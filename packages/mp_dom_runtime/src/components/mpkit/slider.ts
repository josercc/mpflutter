import { MPEnv, PlatformType } from "../../env";
import { setDOMAttribute, setDOMStyle } from "../dom_utils";
import { MPPlatformView } from "../mpkit/platform_view";
import { cssColorHex } from "../utils";

export class MPSlider extends MPPlatformView {
  firstSetup = true;
  sliderElement: any;
  constructor(document: Document) {
    super(document);
    if (MPEnv.platformType === PlatformType.wxMiniProgram) {
      // this.htmlElement.addEventListener("change", (e: any) => {
      //   this.invokeMethod("onSliderChange", { value: e.detail.value });
      // });
      this.htmlElement.addEventListener("changing", (e: any) => {
        this.invokeMethod("onSliderChanging", { value: e.detail.value });
      });
    } else if (MPEnv.platformType === PlatformType.browser) {
      this.htmlElement.addEventListener("change", (value: any) => {
        this.invokeMethod("onSliderChanging", { value: value.detail.value });
      });
      const weuiShadowRoot = this.htmlElement.attachShadow
        ? this.htmlElement.attachShadow({ mode: "closed" })
        : this.htmlElement;
      const cssStyle = document.createElement("link");
      cssStyle.rel = "stylesheet";
      cssStyle.href = "https://cdn.jsdelivr.net/npm/weui@2.4.4/dist/style/weui.min.css";
      weuiShadowRoot.appendChild(cssStyle);

      this.sliderElement = document.createElement("body");
      this.sliderElement.setAttribute("data-weui-theme", "light");

      weuiShadowRoot.appendChild(this.sliderElement);
      setTimeout(() => {
        var totalLen = this.sliderElement.querySelector("#sliderInner")!.clientWidth,
          startLeft = 0,
          startX = 0;
        var sliderTrack = this.sliderElement.querySelector("#sliderTrack") as HTMLDivElement;
        var sliderHandler = this.sliderElement.querySelector("#sliderHandler") as HTMLDivElement;
        sliderHandler.addEventListener("touchstart", (e: any) => {
          startLeft = (parseInt(sliderHandler.style.left) * totalLen) / 100;
          startX = e.changedTouches[0].clientX;
        });
        sliderHandler.addEventListener("touchmove", (e: any) => {
          var dist = startLeft + e.changedTouches[0].clientX - startX,
            percent;
          dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
          percent = (dist / totalLen) * 100;
          sliderTrack.style.width = percent + "%";
          sliderHandler.style.left = percent + "%";
          this.htmlElement.dispatchEvent(new CustomEvent("change", { detail: { value: percent } } as any));
          e.preventDefault();
        });
      }, 300);
    }
  }

  elementType() {
    if (MPEnv.platformType === PlatformType.wxMiniProgram) {
      return "wx-slider";
    }
    return "div";
  }

  setAttributes(attributes: any) {
    super.setAttributes(attributes);
    setDOMAttribute(this.htmlElement, "min", attributes.min);
    setDOMAttribute(this.htmlElement, "max", attributes.max);
    setDOMAttribute(this.htmlElement, "step", attributes.step);
    setDOMAttribute(this.htmlElement, "disabled", attributes.disabled);
    setDOMAttribute(this.htmlElement, "value", attributes.value);
    setDOMAttribute(
      this.htmlElement,
      "active-color",
      attributes.activeColor ? cssColorHex(attributes.activeColor) : null
    );
    setDOMAttribute(
      this.htmlElement,
      "background-color",
      attributes.backgroundColor ? cssColorHex(attributes.backgroundColor) : null
    );
    setDOMAttribute(this.htmlElement, "block-size", attributes.blockSize);
    setDOMAttribute(this.htmlElement, "block-color", attributes.blockColor ? cssColorHex(attributes.blockColor) : null);
    setDOMAttribute(this.htmlElement, "show-value", attributes.showValue);
    if (MPEnv.platformType === PlatformType.browser && this.firstSetup) {
      this.firstSetup = false;
      this.sliderElement.innerHTML = `<div class="weui-slider">
        <div id="sliderInner" class="weui-slider__inner">
          <div id="sliderTrack" style="width: ${
            parseInt(this.attributes?.value) ?? 0
          }%;" class="weui-slider__track"></div>
          <div role="slider" aria-label="thumb" id="sliderHandler" style="left: ${
            parseInt(this.attributes?.value) ?? 0
          }%;" class="weui-slider__handler weui-wa-hotarea"></div>
        </div>
      </div>`;
    }
  }
}
