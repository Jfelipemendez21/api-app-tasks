import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  pageSize: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().optional(),
  role: z.string().optional(),
  order: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional().default('desc'),
});

export type PaginationQueryDto = z.infer<typeof paginationQuerySchema>;
