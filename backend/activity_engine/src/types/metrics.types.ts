import { ContentTypeEnum } from "@prisma/client";

export interface ViolationInput {
    studentId: string;
    contentType: ContentTypeEnum;
    contentTypeId: string;
    violationType: string;
    images: ViolationImageInput[]; // Array of image data
}

export interface ViolationImageInput {
    base64Image: string; // Base64-encoded string
}
