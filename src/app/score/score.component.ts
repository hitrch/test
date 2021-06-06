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
export class ScoreComponent implements AfterViewInit {
  displayedColumns: string[] = ['item', 'score', 'winner'];
  itemArray: MatTableDataSource<{ name: string, score: number, winner: number }>;
  matrixOfPreference: Array<Array<number>>;

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private messageService: MessageService) {
    this.itemArray = new MatTableDataSource();
    this.matrixOfPreference = [];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sort.sort(({id: 'score', start: 'desc'}) as MatSortable);
      this.itemArray.sort = this.sort;
      this.itemArray.paginator = this.paginator;
    }, 0);
  }

  addItem(newItem: string) {
    if (this.isNewItem(newItem)) {
      let array = [];
      this.itemArray.data.push({name: newItem, score: 0, winner: 0});
      for (let i in this.itemArray.data) {
        array.push(0);
      }
      this.matrixOfPreference = this.matrixOfPreference.filter(item => {
        item.push(0);
        return true;
      });
      this.matrixOfPreference.push(array);
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

  getItemsToCompare(currentItem: { name: string, score: number, winner: number })
    : Array<{ name: string, score: number, winner: number }> {
    let flag = false;
    let arrayToCompare: Array<{ name: string, score: number, winner: number }> = [];

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
      this.changePreference(name1, name2);
    }
    if (position) {
      this.changePreference(name2, name1);
    }

    this.itemArray.sort = this.sort
  }

  changePreference(toItem: string, fromItem: string) {
    this.matrixOfPreference[this.getPositionByName(fromItem)][this.getPositionByName(toItem)] = 0;
    this.matrixOfPreference[this.getPositionByName(toItem)][this.getPositionByName(fromItem)] = 1;
    this.itemArray.data[this.getPositionByName(toItem)].score =
      this.matrixOfPreference[this.getPositionByName(toItem)].reduce((sum, x) => sum + x);
    this.itemArray.data[this.getPositionByName(fromItem)].score =
      this.matrixOfPreference[this.getPositionByName(fromItem)].reduce((sum, x) => sum + x);
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
    return this.matrixOfPreference[this.getPositionByName(name1)][this.getPositionByName(name2)] == 1;
  }

  isWinner(element: { name: string, score: number, winner: number }): boolean {
    let best;

    for (let item of this.matrixOfPreference) {
      if (!best) {
        best = item;
      }
      if (best.reduce((sum, x) => sum + x) < item.reduce((sum, x) => sum + x)) {
        best = item;
      }
    }
    return best ? best.reduce((sum, x) => sum + x) == element.score : false;
  }

}
