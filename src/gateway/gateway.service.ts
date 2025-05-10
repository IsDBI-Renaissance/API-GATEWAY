import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { AI_SERVICE_URLS, DOCUMENT_PARSER_URL } from '../common/constants';
import { Service2Dto } from './dto/gateway.dto'; // Import DTO

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
  private async parseFile(file: Express.Multer.File): Promise<string> {
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
      return parsed.data.text;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new BadRequestException(error.response.data.detail);
      }
      throw new BadRequestException('Error processing document');
    }
  }

  async handleService1Request(text?: string, file?: Express.Multer.File) {
    if (!text && !file) {
      throw new BadRequestException('No input provided for Service 1.');
    }

    let processedText = text || '';

    if (file) {
      const fileText = await this.parseFile(file);
      processedText = processedText ? `${processedText}\n${fileText}` : fileText;
    }

    const serviceUrl = AI_SERVICE_URLS.service1; // Ensure service1 URL is in constants
    if (!serviceUrl) {
      throw new BadRequestException('Service 1 URL not configured.');
    }

    try {
      const response = await axios.post(serviceUrl, {
        input_text: processedText,
        language: 'english',
        visualize: true,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error calling Service 1:', error.message);
      throw new BadRequestException('Error connecting to Service 1');
    }
  }

  async handleService2Request(data: Service2Dto) {
    const serviceUrl = AI_SERVICE_URLS.service2;
    if (!serviceUrl) {
      throw new BadRequestException('Service 2 URL not configured.');
    }

    try {
      const response = await axios.post(serviceUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error calling Service 2:', error.message);
      throw new BadRequestException('Error connecting to Service 2');
    }
  }

  async handleService3Request(text?: string, file?: Express.Multer.File) {
    if (!text && !file) {
      throw new BadRequestException('No input provided for Service 3.');
    }

    let finalText = text || '';

    if (file) {
      const fileText = await this.parseFile(file);
      finalText = finalText ? `${finalText}\n${fileText}` : fileText;
    }

    const serviceUrl = AI_SERVICE_URLS.service3; // Updated service URL
    if (!serviceUrl) {
      throw new BadRequestException('Service 3 URL not configured.'); // Updated service number
    }

    const payload = {
      standard_text: finalText, 
      max_retries: 5, 
      default_quality: 60, 
    };

    console.log(`Attempting to call Service 3 at URL: ${serviceUrl} with payload:`, JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(serviceUrl, payload, { // Use payload variable
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error calling Service 3 - Message:', error.message);
      if (error.response) {
        console.error('Error calling Service 3 - Response Data:', error.response.data);
        console.error('Error calling Service 3 - Response Status:', error.response.status);
        console.error('Error calling Service 3 - Response Headers:', error.response.headers);
      }
      if (error.request) {
        console.error('Error calling Service 3 - Request Data:', error.request); // This might be a large object
      }
      console.error('Error calling Service 3 - Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      throw new BadRequestException('Error connecting to Service 3'); // Updated service number
    }
  }
}
