import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TrainingSession } from "../Models/TrainingSession";
declare const JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi-meet',
  templateUrl: './jitsi-meet.component.html',
  styleUrls: ['./jitsi-meet.component.css']
})
export class JitsiMeetComponent implements AfterViewInit {
  @ViewChild('jitsiContainer', { static: true }) jitsiContainer!: ElementRef<HTMLDivElement>;
  @Input() trainingSession!: TrainingSession | undefined;

  ngAfterViewInit(): void {
    this.initializeJitsiMeet();
  }

  private initializeJitsiMeet(): void {
    if (!this.trainingSession || !this.trainingSession.ts_id) {
      console.warn('Training session is undefined or lacks an ID.');
      return;
    }

    const domain = 'meet.jit.si';
    const options = {
      roomName: `TrainingSession_${this.trainingSession.ts_id}`,
      width: '100%',
      height: 700,
      parentNode: this.jitsiContainer.nativeElement,
      userInfo: {
        displayName: this.trainingSession.trainerId ? `${this.trainingSession.trainerId.firstname} ${this.trainingSession.trainerId.lastname}` : 'Trainer'
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'hangup', 'fullscreen', 'chat', 'raisehand'
        ]
      },
      configOverwrite: {
        prejoinPageEnabled: false
      }
    };

    new JitsiMeetExternalAPI(domain, options);
  }
}
