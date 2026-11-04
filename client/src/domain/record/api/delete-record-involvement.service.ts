import { Request } from '@domain/@shared/request';
import type { Service } from '@domain/@shared/service.type';

import type { Involvement } from '../involvement.type';
import type { Record as RecordType } from '../record.type';

type Response =
    | Service.DefaultResponse
    | Service.ExceptionResponse;

/**
 * @service
 * @route /records/:recordId/involvements/:id
 * @http DELETE
 */
export const deleteRecordInvolvement = (
    recordId: RecordType.Model['id'],
    involvementId: Involvement.Model['id'],
): Promise<Response> =>
    Request.delete(`/records/${recordId}/involvements/${involvementId}`);

