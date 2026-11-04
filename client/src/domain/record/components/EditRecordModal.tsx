import { useCallback, useEffect, useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';
import { useCompaniesContext } from '@domain/company/Companies.context';
import type { Person } from '@domain/person/person.type';

import { createRecordInvolvement } from '../api/create-record-involvement.service';
import { deleteRecordInvolvement } from '../api/delete-record-involvement.service';
import { listRecordInvolvements } from '../api/list-record-involvements.service';
import { updateRecord } from '../api/update-record.service';
import type { Involvement } from '../involvement.type';
import { useRecordsContext } from '../Records.context';
import { RecordFields, type Values } from './RecordFields';
import { RecordInvolvementsSection, type InvolvementItem } from './RecordInvolvementsSection';

export function EditRecordModal() {
    const [isSending, setIsSending] = useState(false);
    const [involvements, setInvolvements] = useState<InvolvementItem[]>([]);
    const [isLoadingInvolvements, setIsLoadingInvolvements] = useState(true);

    const {
        record,
        setIsEditModalVisible,
        setRecordId,
        fetchRecords,
        refreshInvolvements,
    } = useRecordsContext();

    const { companies } = useCompaniesContext();

    if (!record)
        throw new Error('Value of the `record` property is unknown');

    const app = App.useApp();

    const [form] = Form.useForm<Values>();

    const close = () => {
        setIsEditModalVisible(false);
        setRecordId(null);
    };

    const fetchInvolvements = useCallback(async () => {
        setIsLoadingInvolvements(true);
        const response = await listRecordInvolvements(record.id);
        setIsLoadingInvolvements(false);

        if ('data' in response && response.data?.involvements) {
            setInvolvements(response.data.involvements);
        }
    }, [record.id]);

    useEffect(() => {
        fetchInvolvements();
    }, [fetchInvolvements]);

    const handleAddInvolvement = async (person: Person.Model, type: Involvement.Type) => {
        const response = await createRecordInvolvement(record.id, {
            person_id: person.id,
            type,
        });

        if (hasServiceError(response)) {
            return handleServiceError(app, response, err =>
                err.statusCode === 409
                    ? 'Esta pessoa já está vinculada a este relato.'
                    : null,
            );
        }

        app.message.success('Pessoa vinculada com sucesso!');
        fetchInvolvements();
        fetchRecords();
        refreshInvolvements();
    };

    const handleRemoveInvolvement = async (item: InvolvementItem) => {
        if (!item.id) return;

        const response = await deleteRecordInvolvement(record.id, item.id);

        if (hasServiceError(response)) {
            return handleServiceError(app, response);
        }

        app.message.success('Pessoa desvinculada com sucesso!');
        fetchInvolvements();
        fetchRecords();
        refreshInvolvements();
    };

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await updateRecord(record.id, values);

        await sleep(500);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response);

        app.message.success('Relato atualizado com sucesso!');
        close();
        fetchRecords();
    };

    return (
        <Modal
            open
            title="Editar relato"
            width={720}
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Confirmar"
            onCancel={close}
            cancelText="Cancelar"
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="editRecord"
                layout="vertical"
                autoComplete="off"
                initialValues={record}
            >
                <RecordFields companies={companies} />
            </Form>

            <Divider />

            <RecordInvolvementsSection
                involvements={involvements}
                onAdd={handleAddInvolvement}
                onRemove={handleRemoveInvolvement}
                isLoading={isLoadingInvolvements}
            />
        </Modal>
    );
}
