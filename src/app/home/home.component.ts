import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  imageSrc: string | ArrayBuffer | null = null;
  options = [
    { value: 'resize', label: 'resize' },
    { value: 'crop', label: 'crop' },
    { value: 'grayscale', label: 'convert to gray' },
    { value: 'hsv', label: 'convert to hsv' },
    { value: 'rgb', label: 'convert to rgb' },
    { value: 'flip', label: 'flip' },
    { value: 'rotate', label: 'rotate' },
    { value: 'blur', label: 'blur' },
    { value: 'median blur', label: 'median blur' },
    { value: 'histogram', label: 'equalize image histogram' },
    { value: 'threshold', label: 'threshold' },
    { value: 'canny', label: 'canny edge detection' },
  ];
  fields: { placeholder: string; option: string }[] = [
    { placeholder: 'Width', option: 'resize' },
    { placeholder: 'Height', option: 'resize' },
    { placeholder: 'starting X', option: 'crop' },
    { placeholder: 'starting Y', option: 'crop' },
    { placeholder: 'Width', option: 'crop' },
    { placeholder: 'Height', option: 'crop' },
    { placeholder: 'axis', option: 'flip' },
    { placeholder: 'angle', option: 'rotate' },
    { placeholder: 'kernel size', option: 'mblur' },
    { placeholder: 'kernel size', option: 'blur' },
    { placeholder: 'threshold value', option: 'threshold' },
    { placeholder: 'lower threshold value', option: 'canny' },
    { placeholder: 'upper threshold value', option: 'canny' },
  ];
  currentfields: { placeholder: string; option: string }[] = [];
  buttonText: string = 'Submit';
  fieldValues: { [key: string]: string } = {};
  selectedOption: string = 'resize';
  downloadID: string | null = null; // Default selected option
  showSubmitButton: boolean = true;

  ngOnInit() {
    this.updateFields(this.selectedOption); // Initialize fields based on default option
  }
  constructor(private http: HttpClient) {}
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.loadImage(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.loadImage(input.files[0]);
    }
  }

  loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        this.imageSrc = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  onOptionChange(event: Event) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    this.updateFields(selectedOption);
  }

  updateFields(option: string) {
    if (option === 'resize') {
      this.currentfields = this.fields.filter(
        (field) => field.option === 'resize'
      ); // Remove fields for option2
    } else if (option === 'crop') {
      this.currentfields = this.fields.filter(
        (field) => field.option === 'crop'
      ); // Remove fields for option1
    } else if (option === 'gray') {
      this.currentfields = [];
    } else if (option === 'hsv') {
      this.currentfields = [];
    } else if (option === 'rgb') {
      this.currentfields = [];
    } else if (option === 'flip') {
      this.currentfields = this.fields.filter(
        (field) => field.option === 'flip'
      );
    } else if (option === 'rotate') {
      this.currentfields = this.fields.filter(
        (field) => field.option === 'rotate'
      );
    } else if (option === 'blur') {
      this.currentfields = this.fields.filter(
        (field) => field.option === 'blur'
      );
    } else if (option === 'mblur') {
      this.currentfields = this.fields.filter(
        (field) => field.option === 'mblur'
      );
    } else if (option === 'eh') {
      this.currentfields = [];
    }
    else if (option === 'threshold'){
      this.currentfields = this.fields.filter((field) => field.option === 'threshold');
    }
    else if (option === 'canny'){
      this.currentfields = this.fields.filter((field) => field.option === 'canny');
    
    }
  }
  submit() {
   if (this.imageSrc) {
      // Convert imageSrc to Blob
      const byteString = atob((this.imageSrc as string).split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([intArray], { type: 'image/jpeg' });

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      // Set headers
      const headers = new HttpHeaders({
        // 'Content-Type': 'multipart/form-data'  // Let the browser set it
      });
      let parameters = ''
      Object.keys(this.fieldValues).forEach(key => {
        console.log(this.fieldValues[key])
        parameters += this.fieldValues[key] + ','
      });
      parameters = parameters.substring(0, parameters.length - 1);
      let fullURL = 'localhost::5000/process_image/' + this.selectedOption + '/' + parameters;
      console.log(fullURL);
      // Send POST request
      this.http.post(fullURL, formData, { headers }).subscribe(
        (response: any) => {
          console.log('Upload successful', response);
          this.showSubmitButton = false;
          this.downloadID = response.id;
          // Handle response and enable download if needed
        },
        (error: any) => {
          console.error('Upload failed', error);
        }
      );
    }
}
  download(){

  }
}
