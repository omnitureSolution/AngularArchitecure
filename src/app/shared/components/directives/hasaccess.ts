import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
  } from "@angular/core";
  
  @Directive({ selector: "[hasAccess]" })
  export class HasAccessDirective implements OnInit {
    constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef
      
    ) {}
  
    condition: boolean;
  
    @Input() set hasAccess(systemId: UserSystems) {

        const auth = JSON.parse(window.localStorage.getItem('authentication'));
        const ismanager =  auth.moduleRights.find(a=>a.systemId===32768);
        if(ismanager) {
          this.condition = true;
          return;
        }
        if(auth && auth.moduleRights) {
            const isExists = auth.moduleRights.find(a=>a.systemId===systemId);
            if(isExists && isExists!==undefined && isExists!==null) {
                this.condition = true;
            }else {
                this.condition = false;
            }
        }
      
    }
  
    ngOnInit() {
      if (this.condition) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
  }
  