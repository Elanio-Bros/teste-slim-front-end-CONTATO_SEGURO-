import { useEffect, useState } from 'react';

import { Spin, Tag } from 'antd';

import { listRecordInvolvements } from '../api/list-record-involvements.service';

type Props = {
    recordId: number;
    reloadKey?: number;
};

export function RecordIdentificationCell({ recordId, reloadKey }: Props) {
    const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
    const [totalInvolvements, setTotalInvolvements] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        listRecordInvolvements(recordId)
            .then(response => {
                if (!isMounted) return;
                if ('data' in response && response.data) {
                    setIsAnonymous(response.data.is_anonymous);
                    setTotalInvolvements(response.data.involvements?.length ?? 0);
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [recordId, reloadKey]);

    if (loading) return <Spin size="small" />;

    if (totalInvolvements === 0) {
        return <Tag color="default">Sem Participantes</Tag>;
    }

    if (isAnonymous) {
        return <Tag color="orange">Anônimo</Tag>;
    }

    return <Tag color="green">Identificado</Tag>;
}
