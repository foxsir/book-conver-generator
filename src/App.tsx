import React, {Component} from 'react';
import './App.scss';
import {Row, Col} from "react-flexbox-grid"
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { fabric } from "fabric";

class App extends Component {
  private canvas: fabric.Canvas = new fabric.Canvas('canvas');
  public width = 396;
  public height = 560;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.renderCanvas();
  }

  renderCanvas() {
    this.canvas = new fabric.Canvas('canvas');
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    const bg = new fabric.Rect({
      fill: '#f55',
      top: this.height/2,
      left: this.width/2,
      width: 396,
      height: 560,
      selectable: false
    });

    const grad = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 0,
        x2: this.canvas.width,
        y2: this.canvas.height,
      },
      colorStops: [
        {
          color: 'rgb(166,111,213)',
          offset: "0",
        },
        {
          color: 'orange',
          offset: "1",
        }
    ]});
    bg.fill = grad;
    this.canvas.add(bg);

    this.renderLogo();
    this.renderTitle();
    this.renderSubTitle();

    this.canvas.renderAll();

  }

  renderLogo() {
    fabric.loadSVGFromURL('/assets/images/logo-fill.svg', (objects, options) => {
      let shape = fabric.util.groupSVGElements(objects, options);
      shape.set({
        top: this.height - 50,
        left: 10,
        originX: "left",
        originY: "top",
        selectable: false
      })
      this.canvas.add(shape.scale(0.07));
      this.canvas.renderAll();
    });
  }

  renderTitle() {
    let text = new fabric.Text('hello world', {
      fontSize: 30,
      originX: 'center',
      originY: 'center',
      top: 100,
      selectable: false
    });
    this.canvas.centerObjectH(text);
    this.canvas.add(text);
  }

  renderSubTitle() {
    let text = new fabric.Text('hello world', {
      fontSize: 14,
      originX: 'center',
      originY: 'center',
      top: 100 + 40,
      selectable: false
    });
    this.canvas.centerObjectH(text);
    this.canvas.add(text);
  }

  saveCover() {
    const d = document.createElement("a");
    d.href = this.canvas.toDataURL({format: 'jpeg' });
    d.download = "cover";
    d.click();
  }

  render() {
    return (
      <div id={"main"}>
        <Row middle="xs" style={{height: "60vh"}}>
          <Col xs={12}>
            <Row center="xs">
              <Col xs={8}>
                <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-md5" style={{background: '#fafafa'}}>
                      <Stack horizontal tokens={{childrenGap: 40}}>
                        <canvas id={"canvas"} width={this.width} height={this.height}></canvas>
                      </Stack>
                    </div>
                    <div className="ms-Grid-col ms-md7" style={{background: '#fdfdfd'}}>
                      <Stack horizontal tokens={{childrenGap: 40}}>
                        <PrimaryButton text="Primary" onClick={this.saveCover.bind(this)} />
                      </Stack>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
