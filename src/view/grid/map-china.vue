<template>
<!--  <ve-line :data="chartData"></ve-line>-->
  <div class="h-map">
    <ve-map
      class="echarts-map"
      :data="chartData"
      :settings="chartSettings"
      height="600px"
      width="600px"
      :extend="chartExtend"
    ></ve-map>
  </div>

</template>

<script>
export default {
  name: 'grid-list',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartSettings: {
        position: 'china',
        metrics: ['门店数'],
        itemStyle: {
          normal: {
            borderColor: '#72F2FF',
            areaColor: '#7F8FA3',
            borderWidth: 2,
            shadowBlur: 1
          },
          emphasis: {
            borderColor: '#72F2FF',
            areaColor: '#19355A',
            borderWidth: 1,
            shadowBlur: 1
          }
        },
        label: {
          normal: {
            show: true,
            formatter(params) {
              if (params.value) {
                return `${params.name } ${ params.value}` // 地图上展示文字 + 数值
              }
              return ''
            },
            color: '#fff',
            backgroundColor: 'rgba(0, 15, 42, 0.3)',
            fontSize: 12,
            align: 'right',
            verticalAlign: 'top',
            lineHeight: 12,
            padding: 4,
            borderRadius: 4
          },
          emphasis: {
            show: true,
            formatter(params) {
              if (params.value) {
                return `${params.name  } ${  params.value}` // 地图上展示文字 + 数值
              }
              return ''
            },
            color: '#44F0FF'
          }
        },
        zoom: 1,
        selectData: true,
        scaleLimit: {
          min: 1,
          max: 2
        },
        roam: true
      },
      chartExtend: {
        legend: {
          show: false
        },
        visualMap: [
          {
            type: 'continuous',
            left: 'left',
            top: 'bottom',
            calculable: true,
            text: ['高', '低'],
            inRange: {
              color: ['#4C627F', '#334C6D', '#19355A']
            },
            textStyle: {
              color: '#fff'
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
