//Cria uma classe de erro, que extends o erro padrão, não preciso fazer uma class erro do zero
class AppError extends Error {
    public readonly statusCode: number;
  
    constructor(message: string, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export default AppError;