import { ReallySmallEvents } from "really-small-events";
export declare class INanoSQLInstance {
    config: INanoSQLConfig;
    plugins: INanoSQLPlugin[];
    adapter: INanoSQLAdapter;
    version: number;
    filters: {
        [filterName: string]: ((inputArgs: any) => Promise<any>)[];
    };
    functions: {
        [fnName: string]: INanoSQLFunction;
    };
    earthRadius: number;
    tables: {
        [tableName: string]: INanoSQLTable;
    };
    relations: {
        [name: string]: {
            left: string[];
            sync: "<=" | "<=>" | "=>";
            right: string[];
        };
    };
    state: {
        activeAV: string;
        hasAnyEvents: boolean;
        id: string;
        pid: string;
        peers: string[];
        peerEvents: string[];
        focused: boolean;
        peerMode: boolean;
        connected: boolean;
        ready: boolean;
        selectedTable: string | any[] | (() => Promise<any[]>);
    };
    _queryCache: {
        [id: string]: any[];
    };
    indexTypes: {
        [type: string]: (value: any) => any;
    };
    _eventCBs: {
        Core: ReallySmallEvents;
        [eventName: string]: ReallySmallEvents;
    };
    constructor();
    doFilter<T, R>(filterName: string, args: T): Promise<R>;
    getCache(id: string, args: {
        offset: number;
        limit: number;
    }): any[];
    clearCache(id: string): boolean;
    clearTTL(primaryKey: any): Promise<any>;
    expires(primaryKey: any): Promise<any>;
    _ttlTimer: any;
    _checkTTL(): void;
    selectTable(table?: string | any[] | (() => Promise<any[]>)): INanoSQLInstance;
    getPeers(): any;
    _detectStorageMethod(): any;
    _initPlugins(config: any): any;
    connect(config: INanoSQLConfig): Promise<any>;
    _initPeers(): any;
    on(action: string, callBack: (event: INanoSQLDatabaseEvent) => void): INanoSQLInstance;
    off(action: string, callBack: (event: INanoSQLDatabaseEvent, database: INanoSQLInstance) => void): INanoSQLInstance;
    _refreshEventChecker(): INanoSQLInstance;
    getView(viewName: string, viewArgs?: any): Promise<any>;
    doAction(actionName: string, actionArgs: any): Promise<any>;
    _doAV(AVType: any, table: any, AVName: any, AVargs: any): any;
    query(action: string | ((nSQL: INanoSQLInstance) => INanoSQLQuery), args?: any): INanoSQLQueryBuilder;
    triggerQuery(query: INanoSQLQuery, onRow: (row: any) => void, complete: () => void, error: (err: string) => void): void;
    triggerEvent(eventData: INanoSQLDatabaseEvent): INanoSQLInstance;
    default(replaceObj?: any, table?: string): {
        [key: string]: any;
    } | Error;
    rawDump(tables: string[], onRow: (table: string, row: {
        [key: string]: any;
    }) => void): Promise<any>;
    rawImport(tables: {
        [table: string]: {
            [key: string]: any;
        }[];
    }, onProgress?: (percent: number) => void): Promise<any>;
    disconnect(): Promise<any>;
    observable<T>(getQuery: (ev?: INanoSQLDatabaseEvent) => INanoSQLQuery, tablesToListen?: string[]): INanoSQLObserver<T>;
    extend(scope: string, ...args: any[]): any | INanoSQLInstance;
    loadJS(rows: {
        [key: string]: any;
    }[], onProgress?: (percent: number) => void): Promise<any[]>;
    JSONtoCSV(json: any[], printHeaders?: boolean, useHeaders?: string[]): string;
    csvToArray(text: string): any[];
    CSVtoJSON(csv: string, rowMap?: (row: any) => any): any;
    loadCSV(csv: string, rowMap?: (row: any) => any, onProgress?: (percent: number) => void): Promise<any[]>;
}
export declare class INanoSQLQueryBuilder {
    _db: INanoSQLInstance;
    _error: string;
    _AV: string;
    _query: INanoSQLQuery;
    static execMap: any;
    constructor(db: INanoSQLInstance, table: string | any[] | (() => Promise<any[]>), queryAction: string | ((nSQL: INanoSQLInstance) => INanoSQLQuery), queryArgs?: any, actionOrView?: string);
    where(args: any[] | ((row: {
        [key: string]: any;
    }, i?: number, isJoin?: boolean) => boolean)): INanoSQLQueryBuilder;
    orderBy(args: string[]): INanoSQLQueryBuilder;
    groupBy(columns: string[]): INanoSQLQueryBuilder;
    having(args: any[] | ((row: {
        [key: string]: any;
    }, i?: number, isJoin?: boolean) => boolean)): INanoSQLQueryBuilder;
    join(args: INanoSQLJoinArgs | INanoSQLJoinArgs[]): INanoSQLQueryBuilder;
    limit(args: number): INanoSQLQueryBuilder;
    comment(comment: string): INanoSQLQueryBuilder;
    extend(scope: string, ...args: any[]): INanoSQLQueryBuilder;
    union(queries: (() => Promise<any[]>)[], unionAll?: boolean): INanoSQLQueryBuilder;
    offset(args: number): INanoSQLQueryBuilder;
    emit(): INanoSQLQuery;
    ttl(seconds?: number, cols?: string[]): INanoSQLQueryBuilder;
    toCSV(headers?: boolean): any;
    stream(onRow: (row: any) => void, complete: () => void, err: (error: any) => void): void;
    cache(): Promise<{
        id: string;
        total: number;
    }>;
    orm(ormArgs?: (string | IORMArgs)[]): INanoSQLQueryBuilder;
    from(table: string | any[] | (() => Promise<any[]>), asObj?: {
        AS: string;
    }): INanoSQLQueryBuilder;
    exec(): Promise<{
        [key: string]: any;
    }[]>;
}
export declare class INanoSQLObserver<T> {
    _nSQL: INanoSQLInstance;
    _query: (ev?: INanoSQLDatabaseEvent) => INanoSQLQuery;
    _tables: string[];
    _config: any[];
    _order: string[];
    _count: number;
    constructor(_nSQL: INanoSQLInstance, _query: (ev?: INanoSQLDatabaseEvent) => INanoSQLQuery, _tables: string[]);
    debounce(ms: number): this;
    distinct(keyFunc?: (obj: T, event?: INanoSQLDatabaseEvent) => any, compareFunc?: (key1: any, key2: any) => boolean): this;
    filter(fn: (obj: T, idx?: number, event?: INanoSQLDatabaseEvent) => boolean): this;
    map(fn: (obj: T, idx?: number, event?: INanoSQLDatabaseEvent) => any): this;
    first(fn?: (obj: T, idx?: number, event?: INanoSQLDatabaseEvent) => boolean): this;
    skip(num: number): this;
    take(num: number): this;
    subscribe(callback: (value: T, event?: INanoSQLDatabaseEvent) => void | {
        next: (value: T, event?: INanoSQLDatabaseEvent) => void;
        error?: (error: any) => void;
        complete?: (value?: T, event?: INanoSQLDatabaseEvent) => void;
    }): INanoSQLObserverSubscriber;
}
export declare class INanoSQLObserverSubscriber {
    _nSQL: INanoSQLInstance;
    _getQuery: (ev?: INanoSQLDatabaseEvent) => INanoSQLQuery;
    _callback: {
        next: (value: any, event: any) => void;
        error: (error: any) => void;
    };
    _tables: string[];
    _closed: boolean;
    constructor(_nSQL: INanoSQLInstance, _getQuery: (ev?: INanoSQLDatabaseEvent) => INanoSQLQuery, _callback: {
        next: (value: any, event: any) => void;
        error: (error: any) => void;
    }, _tables: string[]);
    exec(event?: INanoSQLDatabaseEvent): void;
    unsubscribe(): void;
    closed(): boolean;
}
export declare class INanoSQLQueryExec {
    nSQL: INanoSQLInstance;
    query: INanoSQLQuery;
    progress: (row: any, i: number) => void;
    complete: () => void;
    error: (err: any) => void;
    _buffer: any[];
    _stream: boolean;
    _selectArgs: ISelectArgs[];
    _whereArgs: IWhereArgs;
    _havingArgs: IWhereArgs;
    _pkOrderBy: boolean;
    _idxOrderBy: boolean;
    _sortGroups: {
        [groupKey: string]: any[];
    };
    _groupByColumns: string[];
    _orderBy: INanoSQLSortBy;
    _groupBy: INanoSQLSortBy;
    constructor(nSQL: INanoSQLInstance, query: INanoSQLQuery, progress: (row: any, i: number) => void, complete: () => void, error: (err: any) => void);
    _maybeJoin(joinData: any, leftRow: any, onRow: any, complete: any): any;
    _select(complete: any, onError: any): any;
    _groupByRows(): any;
    _upsert(onRow: any, complete: any): any;
    _updateRow(newData: any, oldRow: any, complete: any, error: any): any;
    _newRow(newRow: any, complete: any, error: any): any;
    _delete(onRow: any, complete: any): any;
    _getIndexValues(indexes: any, row: any): any;
    _showTables(): any;
    _describe(): any;
    _registerRelation(name: any, relation: any, complete: any, error: any): any;
    _destroyRelation(name: any, complete: any, error: any): any;
    _streamAS(row: any, isJoin: any): any;
    _orderByRows(a: any, b: any): any;
    _sortObj(objA: any, objB: any, columns: any): any;
    createTable(table: INanoSQLTableConfig, complete: () => void, error: (err: any) => void): void;
    alterTable(table: INanoSQLTableConfig, complete: () => void, error: (err: any) => void): void;
    dropTable(table: string, complete: () => void, error: (err: any) => void): void;
    _onError(err: any): any;
    _getByPKs(onlyPKs: any, table: any, fastWhere: any, isReversed: any, orderByPK: any, onRow: any, complete: any): any;
    _fastQuery(onRow: any, complete: any): any;
    _readIndex(onlyPKs: any, fastWhere: any, onRow: any, complete: any): any;
    _getRecords(onRow: any, complete: any): any;
    _rebuildIndexes(table: any, complete: any, error: any): any;
    _where(singleRow: any, where: any, ignoreFirstPath: any): any;
    static likeCache: {
        [likeQuery: string]: RegExp;
    };
    _processLIKE(columnValue: any, givenValue: any): any;
    _getColValue(where: any, wholeRow: any, isJoin: any): any;
    _compare(where: any, wholeRow: any, isJoin: any): any;
    static _sortMemoized: {
        [key: string]: INanoSQLSortBy;
    };
    _parseSort(sort: any, checkforIndexes: any): any;
    static _selectArgsMemoized: {
        [key: string]: {
            hasAggrFn: boolean;
            args: ISelectArgs[];
        };
    };
    _hasAggrFn: any;
    _parseSelect(): any;
    static _whereMemoized: {
        [key: string]: IWhereArgs;
    };
    _parseWhere(qWhere: any, ignoreIndexes?: any): any;
}
export interface INanoSQLConfig {
    id?: string;
    peer?: boolean;
    cache?: boolean;
    queue?: boolean;
    mode?: string | INanoSQLAdapter;
    plugins?: INanoSQLPlugin[];
    version?: number;
    size?: number;
    path?: string;
    warnOnSlowQueries?: boolean;
    disableTTL?: boolean;
    tables?: INanoSQLTableConfig[];
    relations?: {
        [name: string]: [string, "<=" | "<=>" | "=>", string];
    };
    onVersionUpdate?: (oldVersion: number) => Promise<number>;
}
export interface INanoSQLTableConfig {
    name: string;
    model: INanoSQLDataModel[];
    indexes?: {
        name: string;
        path: string;
    }[];
    mapReduce?: {
        name: string;
        call: (evn: INanoSQLDatabaseEvent[]) => void;
        throttle?: number;
        onEvents?: string | string[];
        onTimes?: {
            second?: number | number[];
            minute?: number | number[];
            hour?: number | number[];
            weekDay?: number | number[];
            week?: number | number[];
            date?: number | number[];
            month?: number | number[];
        };
    }[];
    filter?: (row: any) => any;
    actions?: INanoSQLActionOrView[];
    views?: INanoSQLActionOrView[];
    props?: any[];
    _internal?: boolean;
}
export interface INanoSQLSortBy {
    sort: {
        path: string[];
        dir: string;
    }[];
    index: string;
}
export interface INanoSQLPlugin {
    name: string;
    version: number;
    dependencies?: {
        [packageName: string]: number[];
    };
    filters?: {
        name: string;
        priority: number;
        callback: (inputArgs: any) => Promise<any>;
    }[];
}
export interface INanoSQLAdapter {
    plugin: INanoSQLPlugin;
    nSQL: INanoSQLInstance;
    connect(id: string, complete: () => void, error: (err: any) => void): any;
    disconnect(complete: () => void, error: (err: any) => void): any;
    createTable(tableName: string, tableData: INanoSQLTable, complete: () => void, error: (err: any) => void): any;
    dropTable(table: string, complete: () => void, error: (err: any) => void): any;
    disconnectTable(table: string, complete: () => void, error: (err: any) => void): any;
    write(table: string, pk: any, row: {
        [key: string]: any;
    }, complete: (pk: any) => void, error: (err: any) => void): any;
    read(table: string, pk: any, complete: (row: {
        [key: string]: any;
    }) => void, error: (err: any) => void): any;
    delete(table: string, pk: any, complete: () => void, error: (err: any) => void): any;
    readMulti(table: string, type: "range" | "offset" | "all", offsetOrLow: any, limitOrHeigh: any, reverse: boolean, onRow: (row: {
        [key: string]: any;
    }, i: number) => void, complete: () => void, error: (err: any) => void): any;
    readMultiPK(table: string, type: "range" | "offset" | "all", offsetOrLow: any, limitOrHeigh: any, reverse: boolean, onPK: (pk: any, i: number) => void, complete: () => void, error: (err: any) => void): any;
    getIndex(table: string, complete: (index: any[]) => void, error: (err: any) => void): any;
    getNumberOfRecords(table: string, complete: (length: number) => void, error: (err: any) => void): any;
}
export interface INanoSQLActionOrView {
    name: string;
    args?: string[];
    extend?: any;
    call: (args?: any, db?: any) => Promise<any[]>;
}
export interface INanoSQLFunction {
    type: "A" | "S";
    aggregateStart?: {
        result: any;
        row?: any;
        [key: string]: any;
    };
    call: (query: INanoSQLQuery, row: any, isJoin: boolean, prev: {
        result: any;
        row?: any;
        [key: string]: any;
    }, ...args: any[]) => {
        result: any;
        row?: any;
        [key: string]: any;
    };
    whereIndex?: (nSQL: INanoSQLInstance, query: INanoSQLQuery, fnArgs: string[], where: string[]) => IWhereCondition | false;
    queryIndex?: (nSQL: INanoSQLInstance, query: INanoSQLQuery, where: IWhereCondition, onlyPKs: boolean, onRow: (row: any, i: any) => void, complete: () => void) => void;
}
export interface INanoSQLDataModel {
    key: string;
    model?: INanoSQLDataModel[];
    default?: any;
    props?: any[];
}
export interface INanoSQLTable {
    model: INanoSQLDataModel[];
    columns: INanoSQLTableColumn[];
    indexes: {
        [name: string]: INanoSQLIndex;
    };
    filter?: (row: any) => any;
    actions: INanoSQLActionOrView[];
    views: INanoSQLActionOrView[];
    pkType: string;
    pkCol: string;
    ai: boolean;
    props?: any;
}
export interface INanoSQLTableColumn {
    key: string;
    type: string;
    model?: INanoSQLTableColumn[];
    notNull?: boolean;
    default?: any;
}
export interface INanoSQLDatabaseEvent {
    target: string;
    targetId: string;
    events: string[];
    time: number;
    result?: any[];
    actionOrView?: string;
    [key: string]: any;
}
export interface INanoSQLJoinArgs {
    type: "left" | "inner" | "right" | "cross" | "outer";
    with: {
        table: string | any[] | (() => Promise<any[]>);
        as?: string;
    };
    on?: any[];
}
export interface IORMArgs {
    key: string;
    select?: string[];
    orm?: (string | IORMArgs)[];
    offset?: number;
    limit?: number;
    orderBy?: {
        [column: string]: "asc" | "desc";
    };
    groupBy?: {
        [column: string]: "asc" | "desc";
    };
    where?: (row: {
        [key: string]: any;
    }, idx: number) => boolean | any[];
}
export interface INanoSQLQuery {
    table: string | any[] | (() => Promise<any[]>);
    tableAS?: string;
    action: string;
    actionArgs?: {
        [key: string]: any;
    };
    state: "pending" | "processing" | "complete" | "error";
    result: any[];
    time: number;
    extend: {
        scope: string;
        args: any[];
    }[];
    queryID: string;
    comments: string[];
    where?: any[] | ((row: {
        [key: string]: any;
    }, i?: number, isJoin?: boolean) => boolean);
    range?: number[];
    orm?: (string | IORMArgs)[];
    orderBy?: string[];
    groupBy?: string[];
    having?: any[] | ((row: {
        [key: string]: any;
    }, i?: number, isJoin?: boolean) => boolean);
    join?: INanoSQLJoinArgs | INanoSQLJoinArgs[];
    limit?: number;
    offset?: number;
    ttl?: number;
    ttlCols?: string[];
    skipQueue?: boolean;
    union?: {
        type: "all" | "distinct";
        queries: (() => Promise<any[]>)[];
    };
    [key: string]: any;
}
export interface INanoSQLIndex {
    name: string;
    type: string;
    path: string[];
}
export interface ISelectArgs {
    isFn: boolean;
    value: string;
    as?: string;
    args?: string[];
}
export declare enum IWhereType {
    fast = 0,
    medium = 1,
    slow = 2,
    fn = 3,
    none = 4
}
export interface IWhereCondition {
    index?: string;
    fnName?: string;
    fnArgs?: string[];
    col?: string;
    comp: string;
    value: string | string[];
}
export interface IWhereArgs {
    type: IWhereType;
    whereFn?: (row: {
        [name: string]: any;
    }, index: number) => boolean;
    fastWhere?: (IWhereCondition | string)[];
    slowWhere?: (IWhereCondition | string | (IWhereCondition | string)[])[];
}
export interface abstractFilter {
    abort?: {
        source: string;
        reason: string;
        [key: string]: any;
    };
    result?: any;
}
export interface extendFilter extends abstractFilter {
    scope: string;
    args: any[];
}
export interface createTableFilter extends abstractFilter {
    result: INanoSQLTableConfig;
}
export interface queryFilter extends abstractFilter {
    result: INanoSQLQuery;
}
export interface eventFilter extends abstractFilter {
    result: INanoSQLDatabaseEvent;
}
export interface config extends abstractFilter {
    result: INanoSQLConfig;
}
export interface IAVFilterResult {
    AVType: "Action" | "View";
    table: string;
    AVName: string;
    AVargs: any;
}
export interface actionFilter extends abstractFilter {
    result: IAVFilterResult;
}
export interface viewFilter extends abstractFilter {
    result: IAVFilterResult;
}
export interface configFilter extends abstractFilter {
    result: INanoSQLConfig;
}
export interface willConnectFilter extends abstractFilter {
}
export interface readyFilter extends abstractFilter {
}
export interface disconnectFilter extends abstractFilter {
}
