import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';
import { useCompaniesContext } from '@domain/company/Companies.context';
import type { Person } from '@domain/person/person.type';

import { createRecord } from '../api/create-record.service';
import { createRecordInvolvement } from '../api/create-record-involvement.service';
import type { Involvement } from '../involvement.type';
import { useRecordsContext } from '../Records.context';
import { RecordFields, type Values } from './RecordFields';
import { RecordInvolvementsSection, type InvolvementItem } from './RecordInvolvementsSection';

export function CreateRecordModal() {
    const [isSending, setIsSending] = useState(false);
    const [involvements, setInvolvements] = useState<InvolvementItem[]>([]);

    const { setIsCreateModalVisible, fetchRecords, refreshInvolvements } = useRecordsContext();
    const { companies } = useCompaniesContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => {
        setInvolvements([]);
        setIsCreateModalVisible(false);
    };

    const handleAddInvolvement = (person: Person.Model, type: Involvement.Type) => {
        setInvolvements(prev => [...prev, { person_id: person.id, type, person }]);
    };

    const handleRemoveInvolvement = (item: InvolvementItem) => {
        setInvolvements(prev => prev.filter(i => i.person_id !== item.person_id));
    };

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const response = await createRecord(values);

        if (hasServiceError(response)) {
            setIsSending(false);
            return handleServiceError(app, response);
        }

        const newRecord = response.data.record;

        // Vincula as pessoas adicionadas no formulário
        for (const item of involvements) {
            await createRecordInvolvement(newRecord.id, {
                person_id: item.person_id,
                type: item.type,
            });
        }

        await sleep(500);

        setIsSending(false);
        app.message.success('Relato cadastrado com sucesso!');
        refreshInvolvements();
        close();
        fetchRecords();
    };

    return (
        <Modal
            open
            title="Cadastrar relato"
            width={720}
            confirmLoading={isSending}
            onOk={form.submit}
            okText="Cadastrar"
            onCancel={close}
            cancelText="Cancelar"
        >
            <Divider />

            <Form
                form={form}
                onFinish={onFinish}
                name="createRecord"
                layout="vertical"
                autoComplete="off"
            >
                <RecordFields companies={companies} />
            </Form>

            <Divider />

            <RecordInvolvementsSection
                involvements={involvements}
                onAdd={handleAddInvolvement}
                onRemove={handleRemoveInvolvement}
            />
        </Modal>
    );
}
