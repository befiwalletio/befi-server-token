const Decimal = require('decimal.js');

class MathCalc {

    constructor(start) {
        this.start = start;
        this.current=new Decimal(start);
    }

    //+
    add(num){
        this.current=this.current.add(new Decimal(num));
        return this;
    }

    //-
    subtract(num){
        this.current=this.current.sub(new Decimal(num));
        return this;
    }
    //*
    multiply(num){
        this.current=this.current.mul(new Decimal(num));
        return this;
    }
    ///
    divide(num){
        this.current=this.current.div(new Decimal(num));
        return this;
    }

    //
    reset(num){
        this.start=num;
        this.current = new Decimal(num);
        return this;
    }

    toNumber(){
        return this.current.toNumber();
    }
    toString(){
        return this.current.toString();
    }
    toDecimal(){
        return this.current;
    }
    _isEmpty(str){
        return str==undefined || str==null|| str=='';
    }

    scienceNumBelowOne(){
        let value = this.current.toString();
        // console.log('ScienceNum'.red,value)
        if(!this._isEmpty(value)){
            value=`${value}`.toLowerCase();
            var num=value.indexOf('e');
            if(num>=0){
                let values = value.split('e');
                let numStr=values[0];
                numStr=numStr.replace(".","");
                let zeroCount = values[1].replace('-','');
                zeroCount = parseInt(zeroCount);
                let zeroStr='0.';
                for (let i = 0; i < zeroCount-1; i++) {
                    zeroStr+='0';
                }
                let numResult = `${zeroStr}${numStr}`;
                return numResult;
            }
        }
        return value;
    }

}

module.exports = MathCalc;
