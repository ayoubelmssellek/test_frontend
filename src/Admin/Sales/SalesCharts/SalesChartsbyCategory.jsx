import { useQuery } from '@tanstack/react-query';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { fetching_sales_by_type } from '../../../Api/fetchingData/FetchSalesByType';
import { useMemo, useState } from 'react';
import styles from '../SalesCharts/SalesChartsbyCategory.module.css';
import { defaultChartColors } from '../../../Utils/chartColors';

const ApexDonutChartbyCatigory = () => {
  const { t } = useTranslation();
  const [timeFilter, setTimeFilter] = useState(1);

  const { data = [], isLoading, error} = useQuery({
    queryKey: ['sales_by_type', timeFilter],
    queryFn: () => fetching_sales_by_type(timeFilter),
    keepPreviousData: true,
  });
  
  const series = data?.map(item => Number(item.total_sales)) || [];
  const labels = data.map((item) =>
    t(`types.${item.type?.name}`, { defaultValue: item.type?.name })
  );
  const options = useMemo(() => ({
    chart: {
      type: 'donut',
      foreColor: '#5d5d5d',
    },
    labels,
    colors: defaultChartColors.slice(0, labels.length), 
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' },
        },
      },
    ],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 600,
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
      itemMargin: {
        vertical: 8,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: t('filters.Total Sales'),
              color: 'var(--text-color)',
              fontSize: '16px',
              fontWeight: 600,
              formatter: (w) =>
                w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString(),
            },
            value: {
              show: true,
              color: 'var(--text-color)',
              fontSize: '20px',
              fontWeight: 500,
              formatter: (value) => value.toLocaleString(),
            },
          },
        },
      },
    },
  }), [labels, t]);

  const filters = [
    { label: t('filters.Day'), value: 1 },
    { label: t('filters.Week'), value: 7 },
    { label: t('filters.Month'), value: 30 },
  ];

  if (isLoading) return <div>{t('loading')}</div>;
  if (error) return <div>{t('error')}</div>;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.titleAndFilter}>
        <h2 className={styles.chartTitle}>{t('filters.Sales by Types')}</h2>
        <div className={styles.filterButtons}>
          {filters.map(({ label, value }) => (
            <button
              key={value}
              className={`${styles.filterButton} ${timeFilter === value ? styles.active : ''}`}
              onClick={() => setTimeFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div id="chart">
        <ReactApexChart options={options} series={series} type="donut" height={350} />
      </div>
    </div>
  );
};

export default ApexDonutChartbyCatigory;
