import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';

import { createPerson } from '../api/create-person.service';
import { usePeopleContext } from '../People.context';
import { PersonFields, type Values } from './PersonFields';

export function CreatePersonModal() {
    const [isSending, setIsSending] = useState(false);

    const { setIsCreateModalVisible, fetchPeople } = usePeopleContext();

    const [form] = Form.useForm<Values>();

    const app = App.useApp();

    const close = () => setIsCreateModalVisible(false);

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const payload = {
            name: values.name.trim(),
            cpf: values.cpf.replace(/\D/g, ''),
            email: values.email.trim(),
            birth_date: values.birth_date.format('YYYY-MM-DD'),
        };

        const response = await createPerson(payload);

        await sleep(500);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response, err => err.statusCode === 409 ? 'Este CPF já está cadastrado no sistema.' : null);

        app.message.success('Pessoa cadastrada com sucesso!');
        close();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Cadastrar pessoa"
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
                name="createPerson"
                layout="vertical"
                autoComplete="off"
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}

