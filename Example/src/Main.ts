//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("heros", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    private touchHandler( evt:egret.TouchEvent):void{
        let tx:egret.TextField = evt.$currentTarget;
        tx.textColor = 0x00ff00;
    }

    private times:number;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let bg:egret.Shape = new egret.Shape();
        //填充颜色，并画矩形，结束绘制
        bg.graphics.beginFill(0x336699);
        bg.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        //将bg添加到某个显示容器中
        super.addChild(bg);
        
        let batman = this.createBitmapByName("hero-4");
        this.addChild(batman);
        batman.x = 0;
        batman.y = 0;
        batman.width = 405;
        batman.height = 616;
        
        let spiter = this.createBitmapByName("hero-3");
        this.addChild(spiter);
        spiter.x = 300;
        spiter.y = 0;
        spiter.width = 405;
        spiter.height = 616;
        
        let captain = this.createBitmapByName("hero-2");
        this.addChild(captain);
        captain.x = 600;
        captain.y = 0;
        captain.width = 405;
        captain.height = 616;

        let iron = this.createBitmapByName("hero-1");
        this.addChild(iron);
        iron.x = 900;
        iron.y = 0;
        iron.width = 405;
        iron.height = 616;
        
        //修改显示深度 1.互换位置
        this.setChildIndex(batman, this.getChildIndex(spiter));

        //2.交换显示深度
        this.swapChildren(captain,iron);

        //3.不可逾越的显示最大值
        this.setChildIndex(spiter,20);

        console.log("display indexes:", this.getChildIndex(bg),this.getChildIndex(batman),this.getChildIndex(spiter),this.getChildIndex(captain),this.getChildIndex(iron));
        
        iron.anchorOffsetX = 30;
        iron.anchorOffsetY = 40;
        iron.x += 30;
        iron.y += 40;

        let urlreq:egret.URLRequest = new egret.URLRequest( "http://httpbin.org/user-agent" );
        let urlloader:egret.URLLoader = new egret.URLLoader(); 
        urlloader.addEventListener( egret.Event.COMPLETE, function( evt:egret.Event ):void{
        console.log(evt.target.data);}, this );
        urlloader.load( urlreq );

        this.times = -1;
        let self = this;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            switch( ++ self.times % 3) {
                case 0:egret.Tween.get(batman).to( {x:captain.x}, 300, egret.Ease.circIn);
                       egret.Tween.get(captain).to( {x:batman.x}, 300, egret.Ease.circIn);
                break;
                case 1:egret.Tween.get(spiter).to({alpha:.3}, 300, egret.Ease.circIn).to({alpha:1}, 300, egret.Ease.circIn);
                break;
                case 3:egret.Tween.get(iron).to( {scaleX:.4, scaleY:.4},500,egret.Ease.circIn).to( {scaleX:.1, scaleY:.1},500,egret.Ease.circIn)
                break;
            }
        },this);
      
        /*
        let tx:egret.TextField = new egret.TextField();
        this.addChild(tx);
        tx.text = 'hello world!';
        tx.size = 32;
        tx.x = 100;
        tx.y = 200;
        tx.width = this.stage.stageWidth - 40;
        
        tx.touchEnabled = true;
        tx.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler,this);
        */

        /*
        console.log("hello world");
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);


        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        */

    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
}