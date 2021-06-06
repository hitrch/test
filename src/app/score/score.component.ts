import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MessageService} from 'primeng/api';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortable} from "@angular/material/sort";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements AfterViewInit{
  displayedColumns: string[] = ['item', 'score', 'winner'];
  itemArray: MatTableDataSource<{ name: string, score: Array<number>, winner: number }>;
  matrixOfPreference: Array<number>;
  numberOfItems: number = 0;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private messageService: MessageService) {
    this.itemArray = new MatTableDataSource();
    this.matrixOfPreference = [];
  }

  ngAfterViewInit() {
    this.sort.sort(({ id: 'name', start: 'desc'}) as MatSortable);
    this.itemArray.sort = this.sort;
  }

  addItem(newItem: string) {
    if (this.isNewItem(newItem)) {
      this.numberOfItems++;

      let array = [];
      for (let i = 0; i < this.numberOfItems; i++) {
        array.push(0);
      }

      this.itemArray.data = this.itemArray.data.filter(item => {
        item.score.push(0);
        return true;
      });

      this.itemArray.data.push({name: newItem, score: array, winner: 0});
      this.itemArray.filter = "";
    } else {
      this.messageService.add(({severity: 'warn', summary: 'Warning', detail: 'Item already exists'}));
    }
  }

  isNewItem(newItem: string): boolean {
    for (let item of this.itemArray.data) {
      if (item.name === newItem) {
        return false;
      }
    }
    return true;
  }

  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  getItemsToCompare(currentItem: { name: string, score: Array<number>, winner: number })
    : Array<{ name: string, score: Array<number>, winner: number }> {
    let flag = false;
    let arrayToCompare: Array<{ name: string, score: Array<number>, winner: number }> = [];

    for (let item of this.itemArray.data) {
      if (flag) {
        arrayToCompare.push(item);
      }
      if (currentItem.name === item.name) {
        flag = true;
      }
    }
    return arrayToCompare;
  }

  changeScore(name1: string, name2: string, position: number) {
    if (!position) {
      this.itemArray.data[this.getPositionByName(name2)].score[this.getPositionByName(name1)] = 0;
      this.itemArray.data[this.getPositionByName(name1)].score[this.getPositionByName(name2)] = 1;
    }
    if (position) {
      this.itemArray.data[this.getPositionByName(name1)].score[this.getPositionByName(name2)] = 0;
      this.itemArray.data[this.getPositionByName(name2)].score[this.getPositionByName(name1)] = 1;
    }
  }

  getPositionByName(name: string): number {
    let i: number = 0;

    for (let item of this.itemArray.data) {
      if (item.name === name) {
        return i;
      }

      i++;
    }
    return -1;
  }

  isButtonChosen(name1: string, name2: string): boolean {
    return this.itemArray.data[this.getPositionByName(name1)].score[this.getPositionByName(name2)] == 1;
  }

  getScore(name: string): number {
    return this.itemArray.data[this.getPositionByName(name)].score.reduce((sum, x) => sum + x);
  }

  isWinner(name: string): boolean {
    let best;

    for (let item of this.itemArray.data) {
      if (!best) {
        best = item;
      }
      if (best.score.reduce((sum, x) => sum + x) < item.score.reduce((sum, x) => sum + x)) {
        best = item;
      }
    }
    return best? best.name === name : false;
  }

}
