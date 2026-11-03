import { useState } from 'react';

import { App, Divider, Form, Modal } from 'antd';
import dayjs from 'dayjs';

import { handleServiceError, hasServiceError } from '@domain/@shared/service.helper';
import { sleep } from '@domain/@shared/sleep';

import { updatePerson } from '../api/update-person.service';
import { usePeopleContext } from '../People.context';
import { maskCpf, PersonFields, type Values } from './PersonFields';

export function EditPersonModal() {
    const [isSending, setIsSending] = useState(false);

    const {
        person,
        setIsEditModalVisible,
        setPersonId,
        fetchPeople,
    } = usePeopleContext();

    if (!person)
        throw new Error('Value of the `person` property is unknown');

    const app = App.useApp();

    const [form] = Form.useForm<Values>();

    const close = () => {
        setIsEditModalVisible(false);
        setPersonId(null);
    };

    const onFinish = async (values: Values) => {
        setIsSending(true);

        const payload = {
            name: values.name.trim(),
            cpf: values.cpf.replace(/\D/g, ''),
            email: values.email.trim(),
            birth_date: values.birth_date.format('YYYY-MM-DD'),
        };

        const response = await updatePerson(person.id, payload);

        await sleep(500);

        setIsSending(false);

        if (hasServiceError(response))
            return handleServiceError(app, response, err => err.statusCode === 409 ? 'Este CPF já está cadastrado no sistema.' : null);

        app.message.success('Pessoa atualizada com sucesso!');
        close();
        fetchPeople();
    };

    return (
        <Modal
            open
            title="Editar pessoa"
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
                name="editPerson"
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    ...person,
                    cpf: maskCpf(person.cpf),
                    birth_date: person.birth_date ? dayjs(person.birth_date) : undefined,
                }}
            >
                <PersonFields />
            </Form>
        </Modal>
    );
}

