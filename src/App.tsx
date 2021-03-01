import React, {Component} from 'react';
import './App.scss';
import GradientGenerator from "./gradient-generator"
import {fabric} from "fabric";
import * as blobs2 from "blobs/v2";
import {Button, Card, Col, Tooltip, Input, Row, Radio, Select} from 'antd';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import illustrationList from "./illustration-json";

const { Option } = Select;

class App extends Component<any, any> {
  private canvas: fabric.Canvas = new fabric.Canvas('canvas');
  public width = 396;
  public height = 560;
  public fontColor: string = "white";
  public title: fabric.Text | undefined;
  public subTitle: fabric.Text | undefined;
  public description: fabric.Text | undefined;
  public blob: fabric.Object | undefined;
  public background: fabric.Object | undefined;
  public illustration: fabric.Object | undefined;
  public bookNumber: fabric.Group | undefined;

  public fonts = [
    {label: "思源黑体", name: "SourceHanSansSC-Regular"},
    {label: "思源黑体 HW Bold", name: "SourceHanSansHWSC-Bold"},
    {label: "思源黑体 HW", name: "SourceHanSansHWSC-Regular"},
    {label: "思源黑体 Medium", name: "SourceHanSansSC-Medium"},
  ];

  private illustrationList: { name: string, path: string }[] = illustrationList;

  constructor(props: any) {
    super(props);
    this.state = {
      textAlign: 'center',
      filterIllustration: "",
      font: this.fonts[0].name
    };
  }

  componentDidMount() {
    this.renderCanvas();
  }

  renderCanvas() {
    this.canvas = new fabric.Canvas('canvas');
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

    this.renderBackground("grey", "grey");
    this.renderLogo();
    this.renderTitle();
    this.renderSubTitle();
    this.renderDescription();
    this.renderRandomBlob();

    const defaultIllustration = this.illustrationList[Math.floor(Math.random() * this.illustrationList.length)]
    this.renderIllustration(defaultIllustration.path);
    this.canvas.renderAll();
  }

  renderBackground(colorA: string, colorB: string) {
    if (this.background) {
      this.canvas.remove(this.background);
    }
    this.background = new fabric.Rect({
      fill: '#f55',
      top: this.height / 2,
      left: this.width / 2,
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
          color: colorA,
          offset: "0",
        },
        {
          color: colorB,
          offset: "1",
        }
      ]
    });
    this.background.fill = grad;
    this.canvas.add(this.background);
    this.background.sendToBack();
    this.canvas.renderAll();
  }

  removeRandomBlob() {
    if (this.blob) {
      this.canvas.remove(this.blob);
    }
  }

  renderRandomBlob() {
    if (this.blob) {
      this.canvas.remove(this.blob);
    }
    let svgString = blobs2.svg(
      {
        seed: Math.random(),
        extraPoints: 4,
        randomness: 3,
        size: 256,
      },
      {
        fill: "rgba(255,255,255,0.1)", // 🚨 NOT SANITIZED
        stroke: "none", // 🚨 NOT SANITIZED
        strokeWidth: 4,
      },
    );

    fabric.loadSVGFromString(svgString, (objects, options) => {
      this.blob = fabric.util.groupSVGElements(objects, options);
      this.blob.set({
        top: this.height / 2,
        originX: "center",
        originY: "top",
        selectable: false
      })
      this.canvas.centerObjectH(this.blob)
      this.canvas.add(this.blob.scale(1));
      this.canvas.renderAll();
    });
  }

  renderIllustration(path: string) {
    if (this.illustration) {
      this.canvas.remove(this.illustration);
    }
    this.setImage(path);
  }

  private setImage(path: string) {
    fabric.Image.fromURL(path, (image: fabric.Image) => {
      if (image && image.width && image.height) {
        let scaleY = 250 / image.height;
        let scaleX = (image.width * scaleY) / image.width;

        if (image.width * scaleY > 250) {
          scaleX = 200 / image.width;
          scaleY = (image.height * scaleX) / image.height;
        }

        image.set({
          scaleY: scaleY,
          scaleX: scaleX,
          top: this.height / 2 + (200-(image.height * scaleX)),
          originX: "center",
          originY: "top",
          selectable: false
        })
      }
      if (this.illustration) {
        this.canvas.remove(this.illustration);
      }

      this.illustration = image;
      this.canvas.add(this.illustration);
      this.canvas.centerObjectH(this.illustration);
      this.canvas.renderAll();
    });
  }

  renderLogo() {
    fabric.loadSVGFromURL('/assets/images/logo-fill.svg', (objects, options) => {
      let shape = fabric.util.groupSVGElements(objects, options);
      shape.set({
        top: 10,
        left: 10,
        originX: "left",
        originY: "top",
        selectable: false
      })
      this.canvas.add(shape.scale(0.07));
      this.canvas.renderAll();
    });
  }


  changeTitle(event: any = null) {
    this.title?.set({text: event.target.value});
    this.canvas.renderAll();
  }

  renderTitle() {
    let string = "Book Title";
    this.title = new fabric.Text(string, {
      fontSize: 32,
      fontFamily: this.state.font,
      originX: 'center',
      originY: 'center',
      top: 80,
      fill: this.fontColor,
      textAlign: 'center',
      selectable: false
    });

    this.canvas.centerObjectH(this.title);
    this.canvas.add(this.title);
  }

  renderNumber(event: any) {
    if (this.bookNumber && event.target.value.length === 0) {
      this.canvas.remove(this.bookNumber);
      this.canvas.renderAll();
      return;
    } else {
      if (this.bookNumber) {
        this.canvas.remove(this.bookNumber);
      }
      let number = event.target.value.slice(0, 2);
      let string = `第${number}版`;
      let bg = new fabric.Rect({
        fill: 'rgba(0,0,0,0.2)',
        scaleY: 0.5,
        originX: 'center',
        originY: 'center',
        rx: 5,
        ry: 5,
        height: 34,
        width: 44
      });
      let text = new fabric.Text(string, {
        fontSize: 12,
        fontFamily: this.state.font,
        fill: "white",
        selectable: false
      });

      this.bookNumber = new fabric.Group([ bg, text ], {
        originX: 'center',
        originY: 'center',
        top: this.height - 20,
        left: this.width - 50
      });
      this.canvas.add(this.bookNumber);
      this.canvas.renderAll();
    }
  }

  changeSubTitle(event: any = null) {
    this.subTitle?.set({text: event.target.value})
    this.canvas.renderAll();
  }

  renderSubTitle() {
    this.subTitle = new fabric.Text('Book SubTitle', {
      fontSize: 22,
      fontFamily: this.state.font,
      originX: 'center',
      originY: 'center',
      top: 120,
      fill: this.fontColor,
      selectable: false
    });
    this.canvas.centerObjectH(this.subTitle);
    this.canvas.add(this.subTitle);
  }

  changeDescription(event: any = null) {
    this.description?.set({text: event.target.value})
    this.canvas.renderAll();
  }

  renderDescription() {
    this.description = new fabric.Text('Description', {
      fontSize: 14,
      fontFamily: this.state.font,
      originX: 'center',
      originY: 'center',
      top: this.height - 20,
      fill: this.fontColor,
      selectable: false
    });
    this.canvas.centerObjectH(this.description);
    this.canvas.add(this.description);
  }

  filterIllustration(event: any = null) {
    this.setState({
      filterIllustration: event.target.value,
    })
  }

  renderIllustrationBox() {
    const list: any[] = [];
    this.illustrationList.forEach(illustration => {
      if (this.state.filterIllustration && this.state.filterIllustration.length) {
        if (illustration.name.search(this.state.filterIllustration) > -1) {
          list.push(
            <Col span={6} style={{height: '100%'}}>
              <Card
                title={illustration.name}
                hoverable
                cover={<img src={illustration.path} />}
                onClick={() => this.renderIllustration(illustration.path)}
                style={{height: '100%'}}
              >
              </Card>
            </Col>
          );
        }
      } else {
        list.push(
          <Col span={6} style={{height: '100%'}}>
            <Card
              title={illustration.name}
              hoverable
              cover={<img src={illustration.path} />}
              onClick={() => this.renderIllustration(illustration.path)}
              style={{height: '100%'}}
            >
            </Card>
          </Col>
        );
      }
    })

    return list;
  }

  changeColor(event: any) {
    let target = event.target;
    if (target.tagName === "SPAN") {
      target = event.target.parentElement;
    }
    if (target.style.color === "white") {
      target.style.color = "black";
    } else {
      target.style.color = "white";
    }

    this.fontColor = target.style.color;

    this.title?.set({fill: this.fontColor});
    this.subTitle?.set({fill: this.fontColor});
    this.description?.set({fill: this.fontColor});
    this.canvas.renderAll();
  }

  changeTextAlign(event: any) {
    this.setState({
      textAlign: event.target.value
    });

    switch (event.target.value) {
      case "left":
        this.title?.set({
          textAlign: event.target.value, originX: event.target.value, left: 65,
        });
        this.subTitle?.set({
          textAlign: event.target.value, originX: event.target.value, left: 65,
        });
        break;
      case "center":
        this.title?.set({
          textAlign: event.target.value, originX: event.target.value,
        });
        this.subTitle?.set({
          textAlign: event.target.value, originX: event.target.value,
        });
        if (this.title && this.subTitle) {
          this.canvas.centerObjectH(this.title);
          this.canvas.centerObjectH(this.subTitle);
        }
        break;
      case "right":
        this.title?.set({
          textAlign: event.target.value, originX: event.target.value, left: this.width - 65,
        });
        this.subTitle?.set({
          textAlign: event.target.value, originX: event.target.value, left: this.width - 65,
        });
        break;
    }
    this.canvas.renderAll();
  }

  selectFont(value: string) {
    this.title?.set({fontFamily: value});
    this.subTitle?.set({fontFamily: value});
    this.description?.set({fontFamily: value});
    this.canvas.renderAll();
  }

  renderFonts() {
    const fonts: any[] = [];
    this.fonts.forEach((font: any) => {
      fonts.push(<Option value={font.name}>{font.label}</Option>);
    });

    return (
      <Select defaultValue={this.fonts[0].name} style={{ width: 150 }} onChange={this.selectFont.bind(this)}>
        {fonts}
      </Select>
    );
  }

  uploadIllustration(event: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      // convert image file to base64 string
      if(reader.result) {
        this.setImage(reader.result.toString());
      }
    }, false);
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveCover() {
    const d = document.createElement("a");
    d.href = this.canvas.toDataURL({format: 'png'});
    d.download = "cover";
    d.click();
  }

  render() {
    return (
      <div id={"main"} style={{marginTop: '2vh'}}>
        <Row gutter={16}>
          <Col span={8}>
            <Row gutter={[8, 16]}>
              <canvas id={"canvas"} width={this.width} height={this.height}></canvas>
              <Button type={"link"} onClick={this.saveCover.bind(this)} style={{width: '100%'}}>
                保存存图片
              </Button>
            </Row>
          </Col>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Input placeholder="标题" defaultValue={"Book Title"} onChange={this.changeTitle.bind(this)} />
                  </Col>
                  <Col span={12}>
                    <Row justify={"end"} gutter={8}>
                      <Col>{this.renderFonts()}</Col>
                      <Col><Button type={"primary"} onClick={this.changeColor.bind(this)} style={{color: 'white'}}>字体颜色</Button></Col>
                      <Col>
                        <Radio.Group value={this.state.textAlign} onChange={this.changeTextAlign.bind(this)}>
                          <Radio.Button value="left"><AlignLeftOutlined /></Radio.Button>
                          <Radio.Button value="center"><AlignCenterOutlined /></Radio.Button>
                          <Radio.Button value="right"><AlignRightOutlined /></Radio.Button>
                        </Radio.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Input placeholder="副标题" defaultValue={"Book SubTitle"} onChange={this.changeSubTitle.bind(this)} />
              </Col>
              <Col span={24}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Input placeholder="描述"
                           defaultValue="Description"
                           onChange={this.changeDescription.bind(this)} />
                  </Col>
                  <Col span={12}>
                    <Input placeholder="编号"
                           type={'number'}
                           max={20}
                           onChange={this.renderNumber.bind(this)} />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Card title="选择插画" extra={
                  <Row gutter={8}>
                    <Col>
                      <Tooltip title={'支持svg、jpg、png'}>
                        <label className="ant-btn">
                          自定义插画
                          <input hidden={true} onChange={this.uploadIllustration.bind(this)} type={'file'} id={'upload-illustration'} />
                        </label>
                      </Tooltip>
                    </Col>
                    <Col>
                      <Button onClick={this.renderRandomBlob.bind(this)}>更换背景</Button>
                      &nbsp;
                      <Tooltip title={'删除背景'}>
                        <Button type="primary" onClick={this.removeRandomBlob.bind(this)} icon={<CloseCircleOutlined />} />
                      </Tooltip>
                    </Col>
                    <Col>
                      <Input style={{width: '300px'}} placeholder={'筛选插画'} onChange={this.filterIllustration.bind(this)}/>
                    </Col>
                  </Row>
                }>
                  <Row gutter={[8, 8]} style={{height: '300px', overflowY: 'scroll', overflowX: 'hidden'}}>
                    {this.renderIllustrationBox()}
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card title="设置背景">
                  <GradientGenerator changeColor={this.renderBackground.bind(this)} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <p>插画来自：</p>
          </Col>
          <Col span={24}>
            <Row gutter={8}>
              <Col><a className={'ant-btn ant-btn-link'} href="http://www.freepik.com" target={"_blank"}>Designed by macrovector / Freepik</a></Col>
              <Col><a className={'ant-btn ant-btn-link'} href="http://all-free-download.com/" target={"_blank"}>Designed by All-free-download</a></Col>
              <Col><a className={'ant-btn ant-btn-link'} href="https://svgporn.com/" target={"_blank"}>SVG PORN</a></Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
