import { Request } from '@domain/@shared/request';
import type { Service } from '@domain/@shared/service.type';

import type { Involvement } from '../involvement.type';
import type { Record as RecordType } from '../record.type';

type Response =
    | Service.DefaultResponse<Involvement.ListData>
    | Service.ExceptionResponse;

/**
 * @service
 * @route /records/:recordId/involvements
 * @http GET
 */
export const listRecordInvolvements = (
    recordId: RecordType.Model['id'],
): Promise<Response> => Request.get(`/records/${recordId}/involvements`);

