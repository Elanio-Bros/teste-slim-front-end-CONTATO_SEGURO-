import { Request } from '@domain/@shared/request';
import type { Service } from '@domain/@shared/service.type';

import type { Involvement } from '../involvement.type';
import type { Record as RecordType } from '../record.type';

type Body = {
    person_id: number;
    type: Involvement.Type;
};

type Data = { involvement: Involvement.Model };

type Response =
    | Service.DefaultResponse<Data>
    | Service.ExceptionResponse;

/**
 * @service
 * @route /records/:recordId/involvements
 * @http POST
 */
export const createRecordInvolvement = (
    recordId: RecordType.Model['id'],
    body: Body,
): Promise<Response> => Request.post(`/records/${recordId}/involvements`, body);

