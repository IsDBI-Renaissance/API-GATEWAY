# Technical Documentation

## Gateway Service Implementation

### File Type Validation

The gateway service implements strict file type validation to ensure only supported document formats are processed. The validation is performed in the following order:

1. **File Extension Check**
   - Extracts file extension from the original filename
   - Converts to lowercase for case-insensitive comparison
   - Validates against the allowed file types list

2. **Document Processing**
   - If file type is valid, proceeds with document parsing
   - Uses FormData to send the file to the document parser service
   - Handles the response and any potential errors

### Error Handling

The service implements comprehensive error handling for various scenarios:

1. **File Type Validation Errors**
   ```typescript
   if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
     throw new BadRequestException(
       `File type not allowed. Allowed types are: ${ALLOWED_FILE_TYPES.join(', ')}`
     );
   }
   ```

2. **Document Parsing Errors**
   ```typescript
   try {
     const parsed = await axios.post<ParsedDocumentResponse>(DOCUMENT_PARSER_URL, formData, {
       headers: formData.getHeaders(),
     });
     // ... process response
   } catch (error: any) {
     if (error.response?.data?.detail) {
       throw new BadRequestException(error.response.data.detail);
     }
     throw new BadRequestException('Error processing document');
   }
   ```

### Supported File Types

The following file types are supported for document processing:

| Category | File Extensions | Description |
|----------|----------------|-------------|
| PDF | .pdf | Portable Document Format |
| Microsoft Office | .docx, .doc, .xlsx, .xls, .pptx, .ppt | Word, Excel, and PowerPoint documents |
| OpenDocument | .odt, .ods, .odp | OpenDocument text, spreadsheet, and presentation |
| Text Formats | .txt, .md | Plain text and Markdown files |
| Data Formats | .csv, .json, .xml | Structured data formats |
| Web Formats | .html, .htm | Web page formats |
| Rich Text | .rtf | Rich Text Format |

### Implementation Details

#### File Processing Flow

1. **Initial Validation**
   ```typescript
   if (!text && !file) throw new BadRequestException('No input provided.');
   ```

2. **File Type Check**
   ```typescript
   const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
   ```

3. **Document Parsing**
   ```typescript
   const formData = new FormData();
   formData.append('file', file.buffer, file.originalname);
   ```

4. **Response Processing**
   ```typescript
   if (!parsed.data || !parsed.data.text) {
     throw new BadRequestException('No text found in the document');
   }
   ```

#### Error Response Structure

All error responses follow a consistent structure:

```typescript
{
  statusCode: number;
  message: string;
  error?: string;
}
```

Common error scenarios:

1. **Invalid File Type**
   ```json
   {
     "statusCode": 400,
     "message": "File type not allowed. Allowed types are: [list of types]"
   }
   ```

2. **Document Parsing Error**
   ```json
   {
     "statusCode": 400,
     "message": "Error parsing document"
   }
   ```

3. **No Text Content**
   ```json
   {
     "statusCode": 400,
     "message": "No text found in the document"
   }
   ```

### Best Practices

1. **File Validation**
   - Always validate file types before processing
   - Use case-insensitive comparison for file extensions
   - Provide clear error messages with supported types

2. **Error Handling**
   - Use try-catch blocks for async operations
   - Forward specific error messages from services
   - Provide fallback error messages for unknown errors

3. **Response Processing**
   - Validate response data structure
   - Handle missing or invalid data gracefully
   - Combine text content appropriately

4. **Security**
   - Validate file types to prevent malicious uploads
   - Use proper content type headers
   - Implement proper authentication checks

### Testing

The service includes comprehensive tests for:

1. **File Type Validation**
   - Valid file types
   - Invalid file types
   - Case sensitivity

2. **Error Handling**
   - Document parsing errors
   - Invalid file types
   - Missing text content

3. **Response Processing**
   - Valid responses
   - Invalid responses
   - Text combination

### Future Improvements

1. **File Size Validation**
   - Add maximum file size limits
   - Implement file size checks

2. **Content Validation**
   - Add content type verification
   - Implement file content scanning

3. **Performance Optimization**
   - Add file processing caching
   - Implement batch processing

4. **Additional Features**
   - Support for more file types
   - Enhanced error reporting
   - Progress tracking for large files 