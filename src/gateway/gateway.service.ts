import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { AI_SERVICE_URLS, DOCUMENT_PARSER_URL } from '../common/constants';

interface ParsedDocumentResponse {
  text: string;
}

const ALLOWED_FILE_TYPES = [
  '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt',
  '.odt', '.ods', '.odp', '.txt', '.md', '.csv', '.json',
  '.xml', '.html', '.htm', '.rtf'
];

@Injectable()
export class GatewayService {
  async handleRequest(service: string, text?: string, file?: Express.Multer.File) {
    if (!text && !file) throw new BadRequestException('No input provided.');

    let finalText = text || '';

    if (file) {
      // Check if file type is allowed
      const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        throw new BadRequestException(
          `File type not allowed. Allowed types are: ${ALLOWED_FILE_TYPES.join(', ')}`
        );
      }

      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);

      try {
        const parsed = await axios.post<ParsedDocumentResponse>(DOCUMENT_PARSER_URL, formData, {
          headers: formData.getHeaders(),
        });

        if (!parsed.data || !parsed.data.text) {
          throw new BadRequestException('No text found in the document');
        }

        // Append document text to existing text if both exist
        finalText = finalText ? `${finalText}\n${parsed.data.text}` : parsed.data.text;
      } catch (error: any) {
        if (error.response?.data?.detail) {
          throw new BadRequestException(error.response.data.detail);
        }
        throw new BadRequestException('Error processing document');
      }
    }

    const serviceUrl = AI_SERVICE_URLS[service];
    if (!serviceUrl) throw new BadRequestException('Invalid service name');

    // const response = await axios.post(serviceUrl, { text: finalText });
    // return response.data;
    return { text: finalText };
  }
}
