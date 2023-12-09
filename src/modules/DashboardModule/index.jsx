import { Tag, Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import RecentTable, { NutritionChart } from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { result: invoiceResult, isLoading: invoiceLoading } = useFetch(() =>
    request.summary({ entity: 'invoice' })
  );

  const { result: paymentResult, isLoading: paymentLoading } = useFetch(() =>
    request.summary({ entity: 'payment' })
  );

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  const dataTableColumns = [
    {
      title: translate('Client'),
      dataIndex: ['client', 'company'],
    },

    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
          },
        };
      },
      render: (total) => moneyFormatter({ amount: total }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{translate(status)}</Tag>;
      },
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'Budget',
      title: 'Budget Preview',
    },
    {
      result: paymentResult,
      isLoading: paymentLoading,
      entity: 'Budget Spent',
      title: 'Budget Spent Preview',
    },
  ];

  const cards = entityData.map((data, index) => {
    const { result, entity, isLoading } = data;

    if (entity === 'offer') return null;

    return (
      <SummaryCard
        key={index}
        title={translate(data?.entity)}
        tagColor={
          data?.entity === 'invoice' ? 'cyan' : data?.entity === 'Budget Spent' ? 'purple' : 'green'
        }
        prefix={translate('This month')}
        isLoading={isLoading}
        tagContent={result?.total && moneyFormatter({ amount: result?.total })}
      />
    );
  });

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    if (entity === 'payment') return null;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  return (
    <>
      <Row gutter={[32, 32]}>
        {cards}
        <SummaryCard
          title={translate('Due Balance')}
          tagColor={'red'}
          prefix={translate('Amount Left')}
          isLoading={invoiceLoading}
          tagContent={
            invoiceResult?.total_undue && moneyFormatter({ amount: invoiceResult?.total_undue })
          }
        />
      </Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ height: 458 }}>
            <Row className="pad20" gutter={[0, 0]}>
              <NutritionChart entity={'lead'} />
            </Row>
          </div>
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[32, 32]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 12 }}>
          <div className="whiteBox shadow pad20" style={{ height: '100%' }}>
            <h3 style={{ color: '#22075e', marginBottom: 5, padding: '0 20px 20px' }}>
              {'Recent Budget'}
            </h3>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </>
  );
}
