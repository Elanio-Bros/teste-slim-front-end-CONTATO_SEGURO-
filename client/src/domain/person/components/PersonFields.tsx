import { Fragment } from 'react';

import { DatePicker, Form, Input } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

export type Values = {
    name: string;
    cpf: string;
    email: string;
    birth_date: Dayjs;
};

export const maskCpf = (value?: string | null) => {
    if (!value) return '';
    const digits = String(value).replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export function PersonFields() {
    return (
        <Fragment>
            <Form.Item<Values>
                name="name"
                label="Nome Completo"
                rules={[{ required: true, message: 'Por favor, digite o nome completo.' }]}
            >
                <Input placeholder="Nome completo da pessoa" />
            </Form.Item>

            <Form.Item<Values>
                name="cpf"
                label="CPF"
                normalize={maskCpf}
                rules={[
                    { required: true, message: 'Por favor, digite o CPF.' },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            const cleaned = String(value).replace(/\D/g, '');
                            if (cleaned.length !== 11) {
                                return Promise.reject(new Error('O CPF deve ter exatamente 11 dígitos.'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input placeholder="000.000.000-00" maxLength={14} />
            </Form.Item>

            <Form.Item<Values>
                name="email"
                label="E-mail"
                rules={[
                    { required: true, message: 'Por favor, digite um e-mail.' },
                    { type: 'email', message: 'Por favor, digite um e-mail válido.' },
                ]}
            >
                <Input placeholder="exemplo@email.com" />
            </Form.Item>

            <Form.Item<Values>
                name="birth_date"
                label="Data de Nascimento"
                rules={[
                    { required: true, message: 'Por favor, selecione a data de nascimento.' },
                    {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            if (value.isAfter(dayjs(), 'day')) {
                                return Promise.reject(new Error('A data de nascimento não pode ser no futuro.'));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Selecione a data"
                    disabledDate={current => current && current > dayjs().endOf('day')}
                    style={{ width: '100%' }}
                />
            </Form.Item>
        </Fragment>
    );
}
