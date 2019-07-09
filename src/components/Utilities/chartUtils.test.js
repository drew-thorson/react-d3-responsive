import { normalizeDate } from "./chartUtils";

describe("normalizeDate", () => {
  it("returns formatted date when passed a string style date.", () => {
    const chartConfig = {
      title: "",
      htmlId: "AreaGraphSingle",
      className: "area-graph-custom-class",
      xDataKey: "day",
      yDataKey: "count",
      dateFormat: "%m-%d-%Y",
      xFormat: "%e %b %y",
      dataPointDateFormat: "%m/%e/%y",
      yAxisLabel: "Leads",
      xAxisLabel: "Date",
      xToolTipLabel: "Date - ",
      yToolTipLabel: "Leads - ",
      yMaxBuffer: 50,
      data: [
        {
          label: "Dataset A",
          day: "11-2-2016",
          count: 246
        },
        {
          label: "Dataset A",
          day: "12-3-2016",
          count: 19
        },
        {
          label: "Dataset A",
          day: "13-3-2016",
          count: 352
        }
      ],
      width: 1920,
      height: 400,
      labelKey: "label",
      dataType: "date",
      displayLegend: true,
      lineType: "linear",
      removeFirstAndLast: false,
      strokeColor: "#ffffff",
      margin: {
        top: 10,
        right: 40,
        bottom: 30,
        left: 40
      }
    };

    expect(normalizeDate(chartConfig)).toMatchSnapshot();
  });

  it("should pass date object unchanged.", () => {
    const chartConfig = {
      title: "",
      htmlId: "AreaGraphSingle",
      className: "area-graph-custom-class",
      xDataKey: "day",
      yDataKey: "count",
      dateFormat: "%m-%d-%Y",
      xFormat: "%e %b %y",
      dataPointDateFormat: "%m/%e/%y",
      yAxisLabel: "Leads",
      xAxisLabel: "Date",
      xToolTipLabel: "Date - ",
      yToolTipLabel: "Leads - ",
      yMaxBuffer: 50,
      data: [
        {
          label: "Dataset A",
          day: new Date(2018, 1, 5),
          count: 246
        },
        {
          label: "Dataset A",
          day: new Date(2015, 12, 5),
          count: 19
        },
        {
          label: "Dataset A",
          day: new Date(2017, 10, 7),
          count: 352
        }
      ],
      width: 1920,
      height: 400,
      labelKey: "label",
      dataType: "date",
      displayLegend: true,
      lineType: "linear",
      removeFirstAndLast: false,
      strokeColor: "#ffffff",
      margin: {
        top: 10,
        right: 40,
        bottom: 30,
        left: 40
      }
    };

    expect(normalizeDate(chartConfig)).toMatchSnapshot();
  });
});
