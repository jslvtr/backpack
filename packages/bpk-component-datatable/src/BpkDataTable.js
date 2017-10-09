import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { defaultTableRowRenderer, Column, Table, AutoSizer } from 'react-virtualized';
import { cssModules } from 'bpk-react-utils';
import _ from 'lodash';

import STYLES from './bpk-data-table.scss';
import BpkColumn from './BpkColumn';

const getClassName = cssModules(STYLES);

export default class BpkDataTable extends Component {
  constructor(props) {
    super(props);

    const sortBy = 'name';
    const sortDirection = 'ASC';
    const sortedList = this._sortList({ sortBy, sortDirection, list: props.rows });
    let columns = _.cloneDeep(this.props.children);

    if (this.props.dir === 'rtl') {
      columns = _.reverse(columns);
    }

    this.state = {
      sortedList,
      sortBy,
      sortDirection,
      columns,
      rows: props.rows,
      rowSelected: undefined
    };

    this.table = null;
    this.rowClicked = this.rowClicked.bind(this);
    this.rowStyle = this.rowStyle.bind(this);
    this._sort = this._sort.bind(this);
  }

  rowClicked({ event, index, rowData }) {
    if (this.state.rowSelected == index) {
      this.setState({ rowSelected: undefined });
    } else {
      this.setState({ rowSelected: index });
    }
  }

  rowStyle({ index }) {
    const classNames = [getClassName('bpk-data-table__row')];
    if (this.state.rowSelected == index) {
      classNames.push(getClassName('bpk-data-table__row--selected'));
    };
    if (index == -1) {
      classNames.push(getClassName('bpk-data-table__headerRow'));
    }
    return classNames;
  }

  _sort({ sortBy, sortDirection }) {
    const sortedList = this._sortList({ sortBy, sortDirection, list: this.state.rows });

    this.setState({ sortBy, sortDirection, sortedList });
  }

  _sortList({ sortBy, sortDirection, list }) {
    const sorted = _.sortBy(list, sortBy);
    if (sortDirection === 'DESC') {
      return _.reverse(sorted);
    }
    return sorted;
  }

  render() {
    const { sortedList, sortDirection, sortBy } = this.state; 

    return (
      <AutoSizer disableHeight>
      {({width}) =>
        <Table
          className={getClassName('bpk-data-table')}
          ref={table => { this.table = table; }}
          width={width}
          height={300}
          headerHeight={60}
          rowHeight={60}
          rowCount={sortedList.length}
          rowGetter={({ index }) => sortedList[index]}
          headerClassName={getClassName('bpk-data-table__headerColumn')}
          rowClassName={this.rowStyle}
          onRowClick={this.rowClicked}
          sort={this._sort}
          sortBy={sortBy}
          sortDirection={sortDirection} 
          gridStyle={{ direction: this.props.dir }}
        >
          {
            this.state.columns.map((child, index) => (
              BpkColumn({ ...child.props, key: index })
            ))
          }
        </Table>}
      </AutoSizer>
    );
  }
};