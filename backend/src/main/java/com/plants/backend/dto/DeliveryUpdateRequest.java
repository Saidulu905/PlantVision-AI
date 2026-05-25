package com.plants.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryUpdateRequest {

    @NotBlank(message = "Delivery status cannot be blank")
    private String deliveryStatus;

    private LocalDate estimatedDate;
}
