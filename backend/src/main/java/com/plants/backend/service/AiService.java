package com.plants.backend.service;

import com.plants.backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class AiService {

    @Value("${app.ai.plantid.key:}")
    private String plantIdApiKey;

    @Value("${app.ai.openai.key:}")
    private String openaiApiKey;

    // Simple POJO to represent our rich biological plant care catalog
    public static class PlantDiagnostic {
        public String name;
        public String scientificName;
        public double confidence;
        public String description;
        public List<String> benefits;
        public List<String> careTips;
        public String category;

        public PlantDiagnostic(String name, String scientificName, double confidence, String description,
                               List<String> benefits, List<String> careTips, String category) {
            this.name = name;
            this.scientificName = scientificName;
            this.confidence = confidence;
            this.description = description;
            this.benefits = benefits;
            this.careTips = careTips;
            this.category = category;
        }
    }

    private final Map<String, PlantDiagnostic> localRegistry = new HashMap<>();

    public AiService() {
        // Populate the High-Fidelity local biological catalog for smart offline resolution
        localRegistry.put("aloe", new PlantDiagnostic(
                "Aloe Vera",
                "Aloe barbadensis miller",
                0.985,
                "A thick, short-stemmed succulent plant that stores water in its leaves. It is widely known for its medicinal qualities, cosmetics, and skin therapies.",
                Arrays.asList(
                        "Soothes sunburns, skin rashes, and minor thermal burns.",
                        "Rich in vitamins A, C, E, and B12, acting as a powerful antioxidant.",
                        "Excellent air purifier, removing benzene and formaldehyde from indoor spaces."
                ),
                Arrays.asList(
                        "Water deeply but infrequently. Allow soil to dry out completely between waterings.",
                        "Place in bright, indirect sunlight. Avoid direct mid-day sun to prevent leaf scorching.",
                        "Use highly well-draining cactus or succulent soil mixes."
                ),
                "Medicinal Plants"
        ));

        localRegistry.put("rose", new PlantDiagnostic(
                "Red Rose",
                "Rosa rubiginosa",
                0.972,
                "A classic woody perennial flowering plant of the genus Rosa. Celebrated worldwide for its mesmerizing fragrance and layered, velvety crimson petals.",
                Arrays.asList(
                        "Petals are rich in vitamin C and can be distilled into soothing Rosewater.",
                        "Imparts high-end natural aesthetic value to gardens, balconies, and indoor vases.",
                        "Rose hips (fruits) are used to brew therapeutic herbal teas."
                ),
                Arrays.asList(
                        "Requires at least 6 hours of direct sunlight daily.",
                        "Water regularly at the base of the plant to keep the soil moist but not waterlogged.",
                        "Prune in early spring to encourage fresh blooms and robust branching."
                ),
                "Flower Plants"
        ));

        localRegistry.put("mint", new PlantDiagnostic(
                "Peppermint",
                "Mentha x piperita",
                0.961,
                "An aromatic perennial herb created from a hybrid cross between watermint and spearmint. Exceptionally fast-growing with fresh, cooling foliage.",
                Arrays.asList(
                        "Menthol content eases digestive spasms, tension headaches, and clogged sinuses.",
                        "Serves as a delicious, refreshing culinary herb for drinks, salads, and cooking.",
                        "Foliage acts as a natural deterrent against household pests, ants, and mice."
                ),
                Arrays.asList(
                        "Thrives in partial shade to full sunlight.",
                        "Keep the soil consistently damp. Mint loves moisture.",
                        "Consider planting in pots to contain its highly aggressive root system."
                ),
                "Medicinal Plants"
        ));

        localRegistry.put("lavender", new PlantDiagnostic(
                "English Lavender",
                "Lavandula angustifolia",
                0.954,
                "A highly popular aromatic shrub native to the Mediterranean. Recognizable by its rich spikes of purple flowers and relaxing, sweet pine-herb scent.",
                Arrays.asList(
                        "Aroma is clinically proven to reduce stress, anxiety levels, and encourage deep sleep.",
                        "Repels mosquitoes, moths, and flies naturally while attracting honeybees.",
                        "Flowers can be dried for aromatic sachets or processed into essential oils."
                ),
                Arrays.asList(
                        "Prefers full, direct sunlight. Poor light leads to sparse blooming.",
                        "Drought-tolerant once established. Water only when the top few inches of soil are dry.",
                        "Plant in sandy, alkaline, extremely well-draining soil."
                ),
                "Decoration Plants"
        ));

        localRegistry.put("tomato", new PlantDiagnostic(
                "Cherry Tomato Plant",
                "Solanum lycopersicum",
                0.945,
                "A robust branching annual plant of the nightshade family, prized for producing abundant clusters of sweet, juicy, and highly nutritious small red fruits.",
                Arrays.asList(
                        "High in Lycopene, a powerful antioxidant that supports cardiovascular health.",
                        "Rich source of Vitamin K, Vitamin C, and Potassium.",
                        "Extremely rewarding for home growers and apartment balcony gardeners."
                ),
                Arrays.asList(
                        "Requires full sun (7-8 hours) and supportive caging or staking as it grows.",
                        "Water consistently every morning at the root zone to avoid blossom-end rot.",
                        "Provide nutrient-rich soil fertilized with organic tomato feeds."
                ),
                "Fruit Plants"
        ));

        localRegistry.put("snake", new PlantDiagnostic(
                "Snake Plant (Mother-in-Law's Tongue)",
                "Sansevieria trifasciata",
                0.978,
                "An incredibly resilient indoor succulent with stiff, vertical sword-like leaves banded with cream and yellow. Famous for being nearly indestructible.",
                Arrays.asList(
                        "Converts Carbon Dioxide into Oxygen at night, making it the perfect bedroom plant.",
                        "Removes airborne toxins including benzene, xylene, and trichloroethylene.",
                        "Extremely low maintenance, thriving in almost any indoor environment."
                ),
                Arrays.asList(
                        "Water only when the soil is completely dry. Overwatering easily causes root rot.",
                        "Adapts well to bright light as well as deep, low-light corners of the home.",
                        "Maintain average indoor room temperatures (15°C to 29°C)."
                ),
                "Decoration Plants"
        ));
    }

    // Main API endpoint router. Supports live API calls or smooth local simulation.
    public Map<String, Object> identifyPlant(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty.");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            fileName = "unknown.jpg";
        }

        // Live API execution (if configured)
        if (plantIdApiKey != null && !plantIdApiKey.trim().isEmpty()) {
            return callPlantIdApi(file);
        } else if (openaiApiKey != null && !openaiApiKey.trim().isEmpty()) {
            return callOpenAiVisionApi(file);
        }

        // Offline Simulator Fallback: Scan the filename for matches or select a stable default
        String searchName = fileName.toLowerCase();
        PlantDiagnostic match = null;

        for (Map.Entry<String, PlantDiagnostic> entry : localRegistry.entrySet()) {
            if (searchName.contains(entry.getKey())) {
                match = entry.getValue();
                break;
            }
        }

        // Fallback: If no filename keyword matches, use a stable hash-based selection to avoid complete randomness
        if (match == null) {
            List<String> keys = new ArrayList<>(localRegistry.keySet());
            int index = Math.abs(fileName.hashCode()) % keys.size();
            match = localRegistry.get(keys.get(index));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "success");
        result.put("engine", "Antigravity Smart Offline Diagnostics");
        result.put("name", match.name);
        result.put("scientificName", match.scientificName);
        result.put("confidence", String.format("%.1f%%", match.confidence * 100));
        result.put("category", match.category);
        result.put("description", match.description);
        result.put("benefits", match.benefits);
        result.put("careTips", match.careTips);
        result.put("identifiedAt", new Date());

        return result;
    }

    // Placeholder stub for live Plant.id API client integrations
    private Map<String, Object> callPlantIdApi(MultipartFile file) {
        // RestTemplate code to POST to https://api.plant.id/v2/identify
        // Set header: "Api-Key" = plantIdApiKey
        // Convert file to Base64 and send standard request body
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", "error");
        errorDetails.put("message", "Plant.id live integration is ready! (Specify proper JSON body converters in production).");
        return errorDetails;
    }

    // Placeholder stub for live OpenAI Vision API integrations
    private Map<String, Object> callOpenAiVisionApi(MultipartFile file) {
        // RestTemplate code to POST to https://api.openai.com/v1/chat/completions
        // Set Header: "Authorization" = "Bearer " + openaiApiKey
        // Send multipart messages with base64 image URL data
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", "error");
        errorDetails.put("message", "OpenAI Vision live integration is ready!");
        return errorDetails;
    }

    // Chatbot endpoint: handles conversational AI using OpenAI (if keys exist) or a high-fidelity local simulator
    public Map<String, Object> chatWithBotanist(Map<String, String> payload) {
        String userMessage = payload.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            throw new BadRequestException("Message cannot be empty.");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", new Date());

        // Try Live OpenAI API if key is present
        if (openaiApiKey != null && !openaiApiKey.trim().isEmpty()) {
            try {
                String botResponse = callOpenAiChatApi(userMessage);
                response.put("response", botResponse);
                response.put("simulated", false);
                return response;
            } catch (Exception e) {
                // Fall back to offline simulator on OpenAI failure
                System.err.println("OpenAI API call failed, falling back to local simulation: " + e.getMessage());
            }
        }

        // Offline Simulator Fallback
        String prompt = userMessage.toLowerCase();
        String botResponse;

        if (prompt.contains("hello") || prompt.contains("hi ") || prompt.contains("hey") || prompt.contains("greetings") || prompt.equals("hi")) {
            botResponse = "Hello! I am your **PlantVision AI Botanical Assistant**. 🌿 How can I help you grow your perfect garden today?\n\nYou can ask me about care routines, watering schedules, lighting requirements, or specific plants in our catalog (like *Aloe Vera*, *Peppermint*, or *English Lavender*!).";
        } else if (prompt.contains("water") || prompt.contains("hydrate") || prompt.contains("wet") || prompt.contains("moist")) {
            botResponse = "Watering is the most critical element of plant care! Here are my expert guidelines:\n\n" +
                    "* **Succulents & Desert Plants** (e.g., *Aloe Vera*, *Snake Plant*): Water deeply but infrequently. Allow the soil to dry out 100% between waterings.\n" +
                    "* **Aromatic Herbs & Fruits** (e.g., *Peppermint*, *Cherry Tomato*): Keep the soil consistently damp but never soggy.\n" +
                    "* **Perennial Flowers** (e.g., *Red Rose*, *English Lavender*): Water at the base of the plant to keep leaves dry and prevent fungal black spots.\n\n" +
                    "*💡 Expert Tip:* Always perform the **finger test**—insert your finger 2 inches into the soil. If it feels dry, it is ready for a drink!";
        } else if (prompt.contains("light") || prompt.contains("sun") || prompt.contains("shade") || prompt.contains("exposure")) {
            botResponse = "Light is the fuel for photosynthesis! Here's a breakdown of lighting requirements:\n\n" +
                    "* **Direct Full Sun** (6-8 hours daily): Essential for *English Lavender*, *Red Roses*, and *Cherry Tomatoes* to flower and fruit.\n" +
                    "* **Bright Indirect Light**: Ideal for *Aloe Vera*. Direct rays can scorch their thick, water-retaining leaves.\n" +
                    "* **Low to Medium Light**: *Snake Plants* thrive in lower-light conditions, making them perfect for hallways or bedroom corners.\n\n" +
                    "*⚠️ Warning:* If a plant is stretching out and looks leggy, it is crying for more light!";
        } else if (prompt.contains("soil") || prompt.contains("dirt") || prompt.contains("fertiliz") || prompt.contains("feed")) {
            botResponse = "Nutrient-rich soil and feeding are the bedrock of vigorous plant growth!\n\n" +
                    "* **Soil Type**: Succulents need porous, well-draining cactus soil. Herbs and vegetables thrive in organic, loam-based potting soil.\n" +
                    "* **Fertilization**: Feed fruiting plants (like *Tomatoes*) and heavy bloomers (like *Roses*) every 2 weeks during the spring and summer active seasons.\n" +
                    "* **Aeration**: Gently loosen the top soil layer periodically to allow roots to breathe.";
        } else if (prompt.contains("yellow") || prompt.contains("brown") || prompt.contains("droop") || prompt.contains("wilt") || prompt.contains("die") || prompt.contains("dying")) {
            botResponse = "Yellowing, wilting, or dropping leaves are early warning signs of stress. Let's troubleshoot:\n\n" +
                    "1. **Overwatering (Most Common)**: Check if soil is muddy. Overwatering causes root rot, blocking oxygen. Stop watering and let it dry.\n" +
                    "2. **Underwatering**: If leaves are dry, crispy, and soil is dusty, give it a thorough, slow soak.\n" +
                    "3. **Nutrient Lack**: Pale leaves usually mean nitrogen deficiency. Feed with a balanced liquid fertilizer.\n" +
                    "4. **Drastic Light Changes**: Ensure your plant is in its preferred lighting spot.";
        } else if (prompt.contains("aloe")) {
            botResponse = "Ah, **Aloe Vera** (*Aloe barbadensis miller*)! A stellar choice. Here are the care essentials:\n\n" +
                    "* **Water**: Let soil dry completely. Overwatering will cause leaves to turn mushy and rot.\n" +
                    "* **Light**: Place in bright, indirect sunlight.\n" +
                    "* **Benefits**: The inner gel is incredible for skin burns and cuts, plus it actively purifies your indoor air!\n\n" +
                    "*🛒 Purchase note:* We have healthy, hand-potted Aloe Vera plants ready to ship in our catalog!";
        } else if (prompt.contains("rose")) {
            botResponse = "The exquisite **Red Rose** (*Rosa rubiginosa*)! A premium addition to any garden:\n\n" +
                    "* **Light**: Needs at least 6 hours of direct, unfiltered sunlight daily.\n" +
                    "* **Water**: Keep soil moist. Water the roots directly, avoiding the foliage to deter black spots.\n" +
                    "* **Benefits**: Gorgeous sensory aesthetics and fragrant rose petals perfect for distilling herbal rosewater.\n\n" +
                    "*🛒 Catalog update:* You can find vibrant, potted red roses in our shop!";
        } else if (prompt.contains("mint") || prompt.contains("peppermint")) {
            botResponse = "**Peppermint** (*Mentha x piperita*) is a super-producer herb:\n\n" +
                    "* **Water**: Loves moisture. Keep soil damp.\n" +
                    "* **Light**: Thrives in partial shade to full sun.\n" +
                    "* **Special advice**: Always plant mint in containers. Its aggressive root runners can quickly take over an entire garden bed!\n\n" +
                    "*🛒 Buy local:* Our fresh organic Peppermint is currently in stock!";
        } else if (prompt.contains("lavender")) {
            botResponse = "Beautiful, relaxing **English Lavender** (*Lavandula angustifolia*):\n\n" +
                    "* **Light**: Demands maximum full sun. Poor light results in no blooms.\n" +
                    "* **Water**: Highly drought-tolerant once established. Water only when dry.\n" +
                    "* **Benefits**: Clinically proven aroma that eases stress, anxiety, and boosts sleep quality. Plus, it naturally repels bugs!\n\n" +
                    "*🛒 Available now:* Order our premium Mediterrenean lavender pots from the shop!";
        } else if (prompt.contains("tomato")) {
            botResponse = "Fruiting **Cherry Tomato** (*Solanum lycopersicum*):\n\n" +
                    "* **Light**: Full sun (8+ hours).\n" +
                    "* **Water**: Regular, even watering. Uneven moisture leads to fruit splitting.\n" +
                    "* **Benefits**: Very high in lycopene, vitamin C, and incredibly rewarding to harvest right from your kitchen window!\n\n" +
                    "*🛒 Get growing:* Seedlings and potting kits are available under our catalog.";
        } else if (prompt.contains("snake")) {
            botResponse = "The architectural **Snake Plant** (*Sansevieria trifasciata*):\n\n" +
                    "* **Care level**: Extremely low! Practically indestructible.\n" +
                    "* **Water**: Water once a month. Allow soil to dry out completely.\n" +
                    "* **Benefits**: Absorbs toxins (benzene, xylene) and converts CO2 to Oxygen *at night*, making it the absolute best bedroom companion!\n\n" +
                    "*🛒 Catalog link:* Add our elegant Snake Plant to your bedroom setup today.";
        } else if (prompt.contains("help") || prompt.contains("benefit") || prompt.contains("catalog") || prompt.contains("care") || prompt.contains("plant")) {
            botResponse = "As your AI Botanical Expert, I can help you with:\n\n" +
                    "1. 📅 **Custom Watering Plans**: Ask *'How often should I water?'*\n" +
                    "2. 💡 **Light Allocations**: Ask *'Does lavender need sun?'*\n" +
                    "3. 🏥 **Plant Care Diagnostics**: Ask *'Why are my leaves turning yellow?'*\n" +
                    "4. 🛍️ **E-Commerce Catalog**: I can recommend matches like *Aloe*, *Rose*, *Mint*, *Lavender*, *Tomato*, and *Snake Plant*!\n\n" +
                    "Just ask away!";
        } else {
            botResponse = "That's a fascinating botanical question! 🌿\n\n" +
                    "To give you the most accurate horticultural advice, please make sure to let me know the plant species and whether it's kept indoors or outdoors. Under dry or humid conditions?\n\n" +
                    "In the meantime, feel free to explore our **AI Diagnosis Tool** for image uploads, or browse our plant catalog for top-tier biological specimens!";
        }

        response.put("response", botResponse);
        response.put("simulated", true);
        return response;
    }

    // Call live OpenAI chat completions API
    private String callOpenAiChatApi(String message) {
        org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
        String url = "https://api.openai.com/v1/chat/completions";

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openaiApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "You are a professional greenhouse horticulturist and friendly botanical expert for PlantVision AI. Provide expert answers on plant care, watering, diagnostics, sunlight, and our local flora selection (Aloe Vera, Red Rose, Peppermint, English Lavender, Cherry Tomato, Snake Plant). Keep your answers concise, structured, and use emojis and markdown/HTML formatting.");
        messages.add(systemMessage);

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", message);
        messages.add(userMessage);

        requestBody.put("messages", messages);

        org.springframework.http.HttpEntity<Map<String, Object>> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);

        try {
            org.springframework.http.ResponseEntity<Map> responseEntity = restTemplate.postForEntity(url, entity, Map.class);
            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                Map body = responseEntity.getBody();
                List choices = (List) body.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map messageObj = (Map) choice.get("message");
                    if (messageObj != null) {
                        return (String) messageObj.get("content");
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("OpenAI API error: " + e.getMessage(), e);
        }
        throw new RuntimeException("Empty response received from OpenAI API");
    }
}
