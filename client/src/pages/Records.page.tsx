import { Fragment } from 'react';

import { Button, Row, type TableColumnsType, Typography } from 'antd';

import { Show } from '@domain/@shared/Show';
import { Table } from '@domain/@shared/Table';
import { CompaniesContextProvider } from '@domain/company/Companies.context';
import { CreateRecordModal } from '@domain/record/components/CreateRecordModal';
import { EditRecordModal } from '@domain/record/components/EditRecordModal';
import { RecordIdentificationCell } from '@domain/record/components/RecordIdentificationCell';
import { RecordsActionsCell } from '@domain/record/components/RecordsActionsCell';
import type { Record } from '@domain/record/record.type';
import { RecordsContextProvider } from '@domain/record/Records.context';

const STATUS_LABELS: Record<Record.Status, string> = {
    awaiting_investigation: 'Aguardando investigação',
    investigation_in_progress: 'Investigação em andamento',
    resolved: 'Resolvido',
    archived: 'Arquivado',
};

export function Records() {
    return (
        <CompaniesContextProvider>
            {() => (
                <RecordsContextProvider>
                    {({
                        isLoading,
                        records,
                        setIsCreateModalVisible,
                        isCreateModalVisible,
                        isEditModalVisible,
                        involvementsVersion,
                    }) => {
                        const columns: TableColumnsType<Record.Model> = [
                            {
                                title: 'ID',
                                dataIndex: 'id',
                                render: value => `#${value}`,
                                width: 80,
                            },
                            {
                                title: 'Título',
                                dataIndex: 'title',
                            },
                            {
                                title: 'Identificação',
                                key: 'identification',
                                render: (_, record) => (
                                    <RecordIdentificationCell
                                        recordId={record.id}
                                        reloadKey={involvementsVersion}
                                    />
                                ),
                                width: 170,
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                render: value => STATUS_LABELS[value as Record.Status] ?? value,
                            },
                            {
                                width: 100,
                                render: (_, record) => <RecordsActionsCell record={record} />,
                            },
                        ];

                        return (
                            <Fragment>
                                <main>
                                    <Row justify="space-between" align="middle">
                                        <Typography.Title level={3}>
                                            Relatos
                                        </Typography.Title>

                                        <Button
                                            type="primary"
                                            onClick={() => setIsCreateModalVisible(true)}
                                        >
                                            Cadastrar
                                        </Button>
                                    </Row>

                                    <Table
                                        columns={columns}
                                        dataSource={records}
                                        loading={isLoading}
                                    />
                                </main>

                                <Show when={isCreateModalVisible}>
                                    <CreateRecordModal />
                                </Show>

                                <Show when={isEditModalVisible}>
                                    <EditRecordModal />
                                </Show>
                            </Fragment>
                        );
                    }}
                </RecordsContextProvider>
            )}
        </CompaniesContextProvider>
    );
}
