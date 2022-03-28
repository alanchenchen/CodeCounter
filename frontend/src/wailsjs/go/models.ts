/* Do not change, this code is generated from Golang structs */

export {};

export class OpenDialogOptions {


    static createFrom(source: any = {}) {
        return new OpenDialogOptions(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}
export class lineCode {
    lineNO: number;
    code?: string;
    commentFlag?: string;

    static createFrom(source: any = {}) {
        return new lineCode(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.lineNO = source["lineNO"];
        this.code = source["code"];
        this.commentFlag = source["commentFlag"];
    }
}
export class LineCounter {
    totalLineNum: number;
    blankLineNum: number;
    commentLineNum: number;
    totalLineCode: lineCode[];
    blankLineCode: lineCode[];
    commentLineCode: lineCode[];

    static createFrom(source: any = {}) {
        return new LineCounter(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.totalLineNum = source["totalLineNum"];
        this.blankLineNum = source["blankLineNum"];
        this.commentLineNum = source["commentLineNum"];
        this.totalLineCode = this.convertValues(source["totalLineCode"], lineCode);
        this.blankLineCode = this.convertValues(source["blankLineCode"], lineCode);
        this.commentLineCode = this.convertValues(source["commentLineCode"], lineCode);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class FileCodeCounter {
    filePath: string;
    fileType: string;
    data?: LineCounter;

    static createFrom(source: any = {}) {
        return new FileCodeCounter(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.filePath = source["filePath"];
        this.fileType = source["fileType"];
        this.data = this.convertValues(source["data"], LineCounter);
    }

	convertValues(a: any, classs: any, asMap: boolean = false): any {
	    if (!a) {
	        return a;
	    }
	    if (a.slice) {
	        return (a as any[]).map(elem => this.convertValues(elem, classs));
	    } else if ("object" === typeof a) {
	        if (asMap) {
	            for (const key of Object.keys(a)) {
	                a[key] = new classs(a[key]);
	            }
	            return a;
	        }
	        return new classs(a);
	    }
	    return a;
	}
}
export class SaveDialogOptions {


    static createFrom(source: any = {}) {
        return new SaveDialogOptions(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

    }
}