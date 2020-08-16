import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { LoaderService } from '@shared/utility/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  show = false;

  private subscription: Subscription = new Subscription();


  loading: boolean;
  constructor(private loaderService: LoaderService) {}
  ngOnInit() {}

  ngAfterViewInit() {
    this.subscription.add(
      this.loaderService.isLoading.subscribe(v => {
        setTimeout(() => {
          this.loading = v;
        }, 100); 
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
