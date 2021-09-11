import React from 'react'
import styled from 'styled-components'

import { Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Line } from "react-chartjs-2";

const Container = styled.div`
  width: fit-content;
  background-color: rgba(0,0,0,0.4);
  border-radius: 16px;
`
// const data = [
//   {
//     name: '0',
//     uv: 4000,
//     tokens: 24000,
//     amt: 2400,
//   },
//   {
//     name: '66',
//     uv: 4000,
//     tokens: 30000,
//     amt: 2400,
//   },
//   {
//     name: '132',
//     uv: 3000,
//     tokens: 45000,
//     amt: 2210,
//   },
//   {
//     name: '198',
//     uv: 2000,
//     tokens: 8000,
//     amt: 2290,
//   },
//   {
//     name: '264',
//     uv: 2780,
//     tokens: 48000,
//     amt: 2000,
//   },
//   {
//     name: '330',
//     uv: 1890,
//     tokens: 27000,
//     amt: 2181,
//   },
//   {
//     name: '398',
//     uv: 2390,
//     tokens: 25000,
//     amt: 2500,
//   },
//   {
//     name: '463',
//     uv: 3490,
//     tokens: 9000,
//     amt: 2100,
//   },
// ];

export default function History() {
  const [totalCount, setTotalCount] = React.useState(33432);
  const [showDetail, setShowDetail] = React.useState(false);
  const { t } = useTranslation();
    
  const data = {
    labels: ["0", "66", "132", "198", "264", "330", "398", "464"],
    datasets: [
      {
        label: "",
        data: [22000, 30000, 45000, 13000, 48000, 27000, 25000, 15000],
        borderColor: "#8B2A9B"
      }
    ]
  };

  const legend = {
    display: false,
    position: "bottom",
    labels: {
      fontColor: "#323130",
      fontSize: 14
    }
  };

  const options = {
    title: {
      display: true,
      text: "Chart Title"
    },
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      ]
    }
  };

  return (
    <Container>
      <Text bold fontSize="24px" pt="15px" pl="13px">History</Text>
      <Line data={data} options={options} />

    </Container>
  )
}