interface CustomErrorProps {
  name: string;
  message: string;
  statusCode: number;
}

export class CustomError extends Error {
  statusCode: number;
  constructor({ name, message, statusCode }: CustomErrorProps) {
    super();
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}
