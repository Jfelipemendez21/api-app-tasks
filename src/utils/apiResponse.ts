import { Response } from 'express';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message: string = 'Operation successful', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    result: PaginatedResult<T>,
    message: string = 'Data retrieved successfully',
    statusCode: number = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: result.data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  }

  static error(res: Response, message: string, statusCode: number = 400, errors: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
