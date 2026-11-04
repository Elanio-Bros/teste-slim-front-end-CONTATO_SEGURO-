import { useEffect, useState } from 'react';

import {
    AuditOutlined,
    BuildOutlined,
    CheckCircleOutlined,
    EyeInvisibleOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { listCompanies } from '@domain/company/api/list-companies.service';
import { listPeople } from '@domain/person/api/list-people.service';
import { listRecordInvolvements } from '@domain/record/api/list-record-involvements.service';
import { listRecords } from '@domain/record/api/list-records.service';
import type { Record as RecordType } from '@domain/record/record.type';
import {
    Alert,
    Card,
    Col,
    Row,
    Skeleton,
    Space,
    Statistic,
    Tag,
    Typography,
} from 'antd';

const STATUS_LABELS: Record<string, string> = {
    awaiting_investigation: 'Aguardando investigação',
    investigation_in_progress: 'Investigação em andamento',
    resolved: 'Resolvido',
    archived: 'Arquivado',
};

const STATUS_COLORS: Record<string, string> = {
    awaiting_investigation: '#faad14',
    investigation_in_progress: '#1890ff',
    resolved: '#52c41a',
    archived: '#8c8c8c',
};

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [companiesTotal, setCompaniesTotal] = useState(0);
    const [peopleTotal, setPeopleTotal] = useState(0);
    const [recordsTotal, setRecordsTotal] = useState(0);

    const [identifiedTotal, setIdentifiedTotal] = useState(0);
    const [anonymousTotal, setAnonymousTotal] = useState(0);
    const [noParticipantsTotal, setNoParticipantsTotal] = useState(0);

    const [recordsByStatus, setRecordsByStatus] = useState<Record<string, number>>({
        awaiting_investigation: 0,
        investigation_in_progress: 0,
        resolved: 0,
        archived: 0,
    });

    useEffect(() => {
        let isMounted = true;

        async function loadDashboardData() {
            setIsLoading(true);

            try {
                const [companiesRes, peopleRes, recordsRes] = await Promise.all([
                    listCompanies(),
                    listPeople(),
                    listRecords(),
                ]);

                if (!isMounted) return;

                if ('data' in companiesRes && companiesRes.data?.companies) {
                    setCompaniesTotal(companiesRes.data.companies.length);
                }

                if ('data' in peopleRes && peopleRes.data?.people) {
                    setPeopleTotal(peopleRes.data.people.length);
                }

                if ('data' in recordsRes && recordsRes.data?.records) {
                    const allRecords: RecordType.Model[] = recordsRes.data.records;
                    setRecordsTotal(allRecords.length);

                    const statusAcc: Record<string, number> = {
                        awaiting_investigation: 0,
                        investigation_in_progress: 0,
                        resolved: 0,
                        archived: 0,
                    };
                    for (const r of allRecords) {
                        if (statusAcc[r.status] !== undefined) {
                            statusAcc[r.status]++;
                        }
                    }
                    setRecordsByStatus(statusAcc);

                    const involvementsResults = await Promise.all(
                        allRecords.map(r => listRecordInvolvements(r.id)),
                    );

                    if (!isMounted) return;

                    let identified = 0;
                    let anonymous = 0;
                    let noParticipants = 0;

                    for (const invRes of involvementsResults) {
                        if ('data' in invRes && invRes.data) {
                            const count = invRes.data.involvements?.length ?? 0;
                            if (count === 0) {
                                noParticipants++;
                            } else if (invRes.data.is_anonymous) {
                                anonymous++;
                            } else {
                                identified++;
                            }
                        }
                    }

                    setIdentifiedTotal(identified);
                    setAnonymousTotal(anonymous);
                    setNoParticipantsTotal(noParticipants);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const calcPercent = (val: number, total: number) =>
        total > 0 ? Math.round((val / total) * 100) : 0;

    // Cálculo das fatias do gráfico de pizza (Donut SVG)
    const pieRadius = 60;
    const pieCircumference = 2 * Math.PI * pieRadius;
    let accumulatedOffset = 0;

    const pieSlices = Object.keys(STATUS_LABELS).map(key => {
        const count = recordsByStatus[key] ?? 0;
        const percent = recordsTotal > 0 ? count / recordsTotal : 0;
        const strokeDasharray = `${percent * pieCircumference} ${pieCircumference}`;
        const strokeDashoffset = -accumulatedOffset;
        accumulatedOffset += percent * pieCircumference;

        return {
            key,
            label: STATUS_LABELS[key],
            color: STATUS_COLORS[key] ?? '#8c8c8c',
            count,
            percent: Math.round(percent * 100),
            strokeDasharray,
            strokeDashoffset,
        };
    });

    // Dados para o gráfico de barras verticais
    const maxBarValue = Math.max(recordsTotal, 1);
    const verticalBars = [
        {
            key: 'identified',
            label: 'Identificados',
            subtitle: 'Com Relatante',
            icon: <CheckCircleOutlined />,
            count: identifiedTotal,
            percent: calcPercent(identifiedTotal, recordsTotal),
            color: '#52c41a',
            tagColor: 'green',
        },
        {
            key: 'anonymous',
            label: 'Anônimos',
            subtitle: 'Sem Relatante',
            icon: <EyeInvisibleOutlined />,
            count: anonymousTotal,
            percent: calcPercent(anonymousTotal, recordsTotal),
            color: '#fa8c16',
            tagColor: 'orange',
        },
        {
            key: 'noParticipants',
            label: 'Sem Participantes',
            subtitle: 'Pendente Triagem',
            icon: <UsergroupAddOutlined />,
            count: noParticipantsTotal,
            percent: calcPercent(noParticipantsTotal, recordsTotal),
            color: '#8c8c8c',
            tagColor: 'default',
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Typography.Title level={3}>Bem-vindo(a) ao Contato Seguro Slim!</Typography.Title>

            <Alert
                type="warning"
                showIcon
                message="Aviso sobre os dados de exemplo"
                description="Os dados cadastrados neste ambiente são meramente ilustrativos e foram gerados para fins de desenvolvimento e teste. Empresas, relatos e demais informações são fictícios. Qualquer semelhança com pessoas, empresas ou situações reais é mera coincidência."
            />
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card bordered>
                        {isLoading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                        ) : (
                            <Statistic
                                title="Empresas Cadastradas"
                                value={companiesTotal}
                                prefix={<BuildOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card bordered>
                        {isLoading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                        ) : (
                            <Statistic
                                title="Base de Pessoas"
                                value={peopleTotal}
                                prefix={<UserOutlined style={{ color: '#722ed1', marginRight: 8 }} />}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card bordered>
                        {isLoading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                        ) : (
                            <Statistic
                                title="Total de Relatos"
                                value={recordsTotal}
                                prefix={<AuditOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card
                        title="Identificação e Anonimato dos Relatos"
                        bordered
                        style={{ height: '100%' }}
                    >
                        {isLoading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        alignItems: 'flex-end',
                                        height: 180,
                                        padding: '16px 8px 8px',
                                        borderBottom: '1px solid #f0f0f0',
                                        marginBottom: 16,
                                    }}
                                >
                                    {verticalBars.map(bar => {
                                        const barHeight = Math.max(
                                            Math.round((bar.count / maxBarValue) * 140),
                                            bar.count > 0 ? 16 : 4,
                                        );

                                        return (
                                            <div
                                                key={bar.key}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    height: '100%',
                                                    width: '28%',
                                                }}
                                            >
                                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                                                    {bar.count} ({bar.percent}%)
                                                </div>
                                                <div
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: 52,
                                                        height: barHeight,
                                                        backgroundColor: bar.color,
                                                        borderRadius: '6px 6px 0 0',
                                                        transition: 'height 0.4s ease',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <Row gutter={[8, 8]}>
                                    {verticalBars.map(bar => (
                                        <Col span={8} key={bar.key} style={{ textAlign: 'center' }}>
                                            <Tag color={bar.tagColor} style={{ marginBottom: 4 }}>
                                                <Space size={4}>
                                                    {bar.icon}
                                                    <span>{bar.label}</span>
                                                </Space>
                                            </Tag>
                                            <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                                                {bar.subtitle}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title="Status Operacional dos Relatos"
                        bordered
                        style={{ height: '100%' }}
                    >
                        {isLoading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : (
                            <Row align="middle" gutter={[16, 16]}>
                                {/* Gráfico de Pizza SVG */}
                                <Col xs={24} sm={11} style={{ textAlign: 'center' }}>
                                    <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                                        {recordsTotal === 0 ? (
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r={pieRadius}
                                                fill="transparent"
                                                stroke="#f0f0f0"
                                                strokeWidth="24"
                                            />
                                        ) : (
                                            pieSlices.map(slice => (
                                                <circle
                                                    key={slice.key}
                                                    cx="80"
                                                    cy="80"
                                                    r={pieRadius}
                                                    fill="transparent"
                                                    stroke={slice.color}
                                                    strokeWidth="24"
                                                    strokeDasharray={slice.strokeDasharray}
                                                    strokeDashoffset={slice.strokeDashoffset}
                                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                                />
                                            ))
                                        )}
                                        {/* Texto no centro da Pizza/Donut */}
                                        <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
                                            <text
                                                x="80"
                                                y="75"
                                                textAnchor="middle"
                                                fontSize="22"
                                                fontWeight="700"
                                                fill="#262626"
                                            >
                                                {recordsTotal}
                                            </text>
                                            <text
                                                x="80"
                                                y="95"
                                                textAnchor="middle"
                                                fontSize="12"
                                                fill="#8c8c8c"
                                            >
                                                Relatos
                                            </text>
                                        </g>
                                    </svg>
                                </Col>

                                {/* Legenda Lateral */}
                                <Col xs={24} sm={13}>
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        {pieSlices.map(slice => (
                                            <div
                                                key={slice.key}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '4px 0',
                                                    borderBottom: '1px dashed #f5f5f5',
                                                }}
                                            >
                                                <Space size={8}>
                                                    <div
                                                        style={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            backgroundColor: slice.color,
                                                        }}
                                                    />
                                                    <span style={{ fontSize: 13 }}>{slice.label}</span>
                                                </Space>
                                                <Tag color={slice.color} style={{ margin: 0 }}>
                                                    {slice.count} ({slice.percent}%)
                                                </Tag>
                                            </div>
                                        ))}
                                    </Space>
                                </Col>
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>
        </Space>
    );
}
