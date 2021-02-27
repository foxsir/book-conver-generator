import React, {Component} from 'react';
import {Button, Col, Row} from "antd";

class GradientGenerator extends Component<{changeColor: Function}> {
  public colorA = "#B149FF";
  public colorB = "#00ffff";

  constructor(props: {changeColor: Function}) {
    super(props);

    window.onload = () => {
      this.props.changeColor(this.colorA, this.colorB);
    }
  }

  componentDidMount() {
    let pickerA = document.getElementById("color-a") as HTMLInputElement,
      pickerB = document.getElementById("color-b") as HTMLInputElement;

    const colorA = pickerA.value,
      colorB = pickerB.value;

    let hexTextA = document.getElementById("hexTextA") as HTMLParagraphElement,
      hexTextB = document.getElementById("hexTextB") as HTMLParagraphElement;

    let generate = document.getElementById("generate") as HTMLButtonElement;

    hexTextA.innerHTML = colorA;
    hexTextB.innerHTML = colorB;

    pickerA.addEventListener("input", (event) => {
      hexTextA.innerHTML = pickerA.value;
      this.props.changeColor(pickerA.value, pickerB.value);
    }, false);

    pickerB.addEventListener("input", (event) => {
      hexTextB.innerHTML = pickerB.value;
      this.props.changeColor(pickerA.value, pickerB.value);
    }, false);

    generate.addEventListener("click", (event) => {
      pickerA.value = this.randomColorGenerator();
      pickerB.value = this.randomColorGenerator();
      this.props.changeColor(pickerA.value, pickerB.value);
    })
  }

  randomColorGenerator() {
    let characters = ["a","b","c","d","e","f",0,1,2,3,4,5,6,7,8,9];
    let randomColorArray = [];
    for (let i = 0; i < 6; i++) {
      let randomIndex = Math.floor(Math.random()*characters.length);
      randomColorArray.push(characters[randomIndex])
    }

    return `#${randomColorArray.join("")}`;
  }

  changeAlpha(events: any) {
    let pickerA = document.getElementById("color-a") as HTMLInputElement,
      pickerB = document.getElementById("color-b") as HTMLInputElement;

    let colorA = this.hexToRgb(pickerA.value);
    let colorB = this.hexToRgb(pickerB.value);

    (document.getElementById("color-range") as HTMLDivElement).innerHTML = `${events.target.value}%`;

    this.props.changeColor(
      `rgba(${colorA.r}, ${colorA.g}, ${colorA.b}, ${events.target.value}%)`,
      `rgba(${colorB.r}, ${colorB.g}, ${colorB.b}, ${events.target.value}%)`,
    );
  }

  hexToRgb(hex: string): {r: number, g: number, b: number} {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
  }

  render() {
    return (
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <form>
            <input type="color" id="color-a" style={{width: '100%'}} value={this.colorA}/>
            <p id="hexTextA"></p>
          </form>
        </Col>
        <Col span={12}>
          <form>
            <input type="color" id="color-b" style={{width: '100%'}} value={this.colorB}/>
            <p id="hexTextB"></p>
          </form>
        </Col>
        <Col span={24}>
          <Button id="generate" block>随机背景色</Button>
        </Col>
        <Col span={24}>
          <form>
            <Row gutter={[4, 4]} justify={"center"} align={"middle"}>
              <Col span={24}> Alpha <span id={"color-range"}>100%</span> </Col>
              <Col span={24}>
                <input type="range" id="alpha" style={{width: '100%'}} onChange={this.changeAlpha.bind(this)} min="60" max="100" defaultValue={100}/>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    )
  }
}


export default GradientGenerator;
