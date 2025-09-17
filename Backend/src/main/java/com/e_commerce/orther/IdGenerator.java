package com.e_commerce.orther;

import java.util.UUID;

public class IdGenerator {
    public static Integer getGenerationId() {
        UUID uuid = UUID.randomUUID();
        return Math.abs((int) (uuid.getMostSignificantBits() & 0xFFFFFFFFL));
    }

}
