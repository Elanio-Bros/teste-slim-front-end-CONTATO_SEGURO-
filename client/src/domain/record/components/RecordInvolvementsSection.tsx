import { useEffect, useState } from 'react';

import { Button, Col, Empty, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { listPeople } from '@domain/person/api/list-people.service';
import type { Person } from '@domain/person/person.type';
import { maskCpf } from '@domain/person/components/PersonFields';

import { INVOLVEMENT_TYPE_LABELS, type Involvement } from '../involvement.type';

export type InvolvementItem = {
    id?: number;
    person_id: number;
    type: Involvement.Type;
    person: Person.Model;
};

const TYPE_COLORS: Record<Involvement.Type, string> = {
    whistleblower: 'blue',
    witness: 'purple',
    victim: 'orange',
    denounced: 'red',
};

const TYPE_OPTIONS = (Object.keys(INVOLVEMENT_TYPE_LABELS) as Involvement.Type[]).map(key => ({
    label: INVOLVEMENT_TYPE_LABELS[key],
    value: key,
}));

type Props = {
    involvements: InvolvementItem[];
    onAdd: (person: Person.Model, type: Involvement.Type) => Promise<void> | void;
    onRemove: (item: InvolvementItem) => Promise<void> | void;
    isLoading?: boolean;
};

export function RecordInvolvementsSection({
    involvements,
    onAdd,
    onRemove,
    isLoading = false,
}: Props) {
    const [allPeople, setAllPeople] = useState<Person.Model[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<Involvement.Type | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchPeopleList = async () => {
            const response = await listPeople();
            if ('data' in response && response.data?.people) {
                setAllPeople(response.data.people);
            }
        };
        fetchPeopleList();
    }, []);

    // Filtra pessoas que ainda não foram vinculadas a este relato
    const availablePeople = allPeople.filter(
        person => !involvements.some(inv => inv.person_id === person.id),
    );

    const handleAdd = async () => {
        if (!selectedPersonId || !selectedType) return;

        const person = allPeople.find(p => p.id === selectedPersonId);
        if (!person) return;

        setIsAdding(true);
        try {
            await onAdd(person, selectedType);
            setSelectedPersonId(null);
            setSelectedType(null);
        } finally {
            setIsAdding(false);
        }
    };

    const columns: TableColumnsType<InvolvementItem> = [
        {
            title: 'Nome',
            dataIndex: ['person', 'name'],
            render: (_, item) => item.person?.name ?? '-',
        },
        {
            title: 'CPF',
            dataIndex: ['person', 'cpf'],
            render: (_, item) => maskCpf(item.person?.cpf),
        },
        {
            title: 'Papel',
            dataIndex: 'type',
            render: (type: Involvement.Type) => (
                <Tag color={TYPE_COLORS[type]}>
                    {INVOLVEMENT_TYPE_LABELS[type] ?? type}
                </Tag>
            ),
        },
        {
            width: 60,
            render: (_, item) => (
                <Popconfirm
                    title="Desvincular pessoa"
                    description="Deseja remover esta pessoa do relato?"
                    onConfirm={() => onRemove(item)}
                    okText="Sim"
                    cancelText="Não"
                    okType="danger"
                >
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        title="Remover"
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Typography.Title level={5} style={{ marginBottom: 12 }}>
                Pessoas Envolvidas
            </Typography.Title>

            <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12}>
                    <Select
                        placeholder="Selecione uma pessoa"
                        value={selectedPersonId}
                        onChange={setSelectedPersonId}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                            String(option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        options={availablePeople.map(p => ({
                            label: `${p.name} (${maskCpf(p.cpf)})`,
                            value: p.id,
                        }))}
                        notFoundContent={<Empty description="Nenhuma pessoa disponível" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    />
                </Col>

                <Col xs={24} sm={8}>
                    <Select
                        placeholder="Selecione o papel"
                        value={selectedType}
                        onChange={setSelectedType}
                        options={TYPE_OPTIONS}
                        style={{ width: '100%' }}
                    />
                </Col>

                <Col xs={24} sm={4}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        loading={isAdding}
                        disabled={!selectedPersonId || !selectedType}
                        style={{ width: '100%' }}
                    >
                        Adicionar
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={involvements}
                rowKey={item => `${item.person_id}-${item.type}`}
                size="small"
                pagination={false}
                loading={isLoading}
                locale={{ emptyText: 'Nenhuma pessoa vinculada a este relato ainda.' }}
            />
        </div>
    );
}

