import React from 'react';
import methods from '../assets/methods';
require("./health.css");
export default class OldHealthList extends React.Component {

    goPrev(){
        if(window.MiFiJsInternal && MiFiJsInternal.finishCurrentActivity){
            methods.finishCurrentActivity();
        }else{
            window.history.back();
        }
    }

    goNext(){
        methods.newStartActivity({
            url:"insurance.html",
            router:"#/oldbuy",
            title:"填写保单",
            urlParams:{
                from:methods.getParam("from") || "local",
                source:methods.getParam("source") || "p0",
                couponFrom:methods.getParam("couponFrom") || "couponDefaultLocal"
            }
        })
    }

    render() {
        return (
            <article className="health-list-wrap">
                <h2>被保险人是否正在或曾经患有以下疾病或存在下列情况:</h2>
                <dl>
                    <dd>
                        1、曾患有、或正在被诊断、或怀疑患有以下疾病：器官移植（不含皮肤及角膜移植）、白血病、淋巴瘤、丙肝抗体阳性、乙肝病毒感染、肝脏疾病、肿瘤、身体肿物、持续的甲状腺肿大、结肠息肉、艾滋病或携带爱滋病病毒（HIV呈阳性）？
                    </dd>
                    <dd>
                        2、在最近6个月内是否存在以下症状：体重持续下降超过5公斤、淋巴肿大或不寻常之皮肤溃烂、反复咳嗽、声音嘶哑、吞咽困难、痰中带血、咯血、呕血、黑便、黄疸、血尿、外生殖器溃疡、阴道不规则出血、重度宫颈糜烂、贫血、皮下肿块、反复皮下出血、鼻衄、反复头痛、晕厥、昏迷、抽搐？是否存在阴道不规则出血或血性溢乳（女性适用）？
                    </dd>
                    <dd>
                        3、存在下列任何检查的异常：肿瘤标志物的血液学检查，前列腺特异性抗原（PSA）针对肿瘤、肿块、囊肿、增生或新生物的超声波、X线、CT、核磁共振等影像学检查，任何活检或病理检查，内窥镜检查？是否曾被建议做重复的宫颈涂片、乳房检查、乳房X光检查或乳房活体检查（女性适用）？
                    </dd>
                    <dd>4、酗酒或有慢性酒精中毒的情况？曾经或正在使用毒品或违禁药物？</dd>
                    <dd>5、曾在其他保险公司投保时被拒保、延期、加费或在附加条件下被承保？</dd>
                    <dd>6、被保险人的父母、兄弟姐妹中是否有任何人患有、或曾经患有癌症/恶性肿瘤？</dd>
                </dl>
                <div className="ins-button" >
                    <div className="content">
                        <div className="a white loan-border">
                            <a onClick={()=>this.goPrev()} href="javascript:;" title="孝心防癌保">有部分情况</a>
                        </div>
                        <div className="a loan-border">
                            <a onClick={()=>this.goNext()} href="javascript:;" title="填写保单">确认健康</a>
                        </div>
                    </div>
                </div>
            </article>
        );
    }
}