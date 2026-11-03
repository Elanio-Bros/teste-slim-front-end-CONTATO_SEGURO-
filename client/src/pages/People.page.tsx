import { Fragment } from 'react';

import { Button, Row, type TableColumnsType, Typography } from 'antd';
import dayjs from 'dayjs';

import { Show } from '@domain/@shared/Show';
import { Table } from '@domain/@shared/Table';
import { PeopleContextProvider } from '@domain/person/People.context';
import type { Person } from '@domain/person/person.type';
import { CreatePersonModal } from '@domain/person/components/CreatePersonModal';
import { EditPersonModal } from '@domain/person/components/EditPersonModal';
import { PeopleActionsCell } from '@domain/person/components/PeopleActionsCell';

const formatCpf = (cpf: string) => {
    if (!cpf || cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const COLUMNS: TableColumnsType<Person.Model> = [
    {
        title: 'ID',
        dataIndex: 'id',
        render: value => `#${value}`,
        width: 80,
    },
    {
        title: 'Nome',
        dataIndex: 'name',
    },
    {
        title: 'CPF',
        dataIndex: 'cpf',
        render: formatCpf,
    },
    {
        title: 'E-mail',
        dataIndex: 'email',
    },
    {
        title: 'Data de Nascimento',
        dataIndex: 'birth_date',
        render: (value: string) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
    {
        width: 100,
        render: (_, record) => <PeopleActionsCell person={record} />,
    },
];

export function People() {
    return (
        <PeopleContextProvider>
            {({
                isLoading,
                people,
                setIsCreateModalVisible,
                isCreateModalVisible,
                isEditModalVisible,
            }) => (
                <Fragment>
                    <main>
                        <Row justify="space-between" align="middle">
                            <Typography.Title level={3}>
                                Pessoas
                            </Typography.Title>

                            <Button
                                type="primary"
                                onClick={() => setIsCreateModalVisible(true)}
                            >
                                Cadastrar
                            </Button>
                        </Row>

                        <Table
                            columns={COLUMNS}
                            dataSource={people}
                            loading={isLoading}
                        />
                    </main>

                    <Show when={isCreateModalVisible}>
                        <CreatePersonModal />
                    </Show>

                    <Show when={isEditModalVisible}>
                        <EditPersonModal />
                    </Show>
                </Fragment>
            )}
        </PeopleContextProvider>
    );
}

