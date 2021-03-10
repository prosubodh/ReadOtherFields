import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ReadOtherFields implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private mainContainer: HTMLDivElement;
	private input: HTMLInputElement;
	private value: string;
	private _notifyOutputChanged: () => void
	private tableContainer: HTMLDivElement;

	constructor() {
	}

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._notifyOutputChanged = notifyOutputChanged;

		this.mainContainer = document.createElement('div');
		this.tableContainer = document.createElement('div');
		this.mainContainer.appendChild(this.tableContainer);
		container.appendChild(this.mainContainer);
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		if (context.parameters.test.raw!) {
			let xml: string = `<fetch mapping='logical'>  
			<entity name='crf6e_appointment'>   
				<attribute name='crf6e_name'/>   
				<attribute name='crf6e_appointment_date'/> 
				<filter type='and'>   
					<condition attribute='crf6e_clinic' operator='eq' value=' ${context.parameters.test.raw!}' />   
				</filter>
			</entity>   
			</fetch>`;

			let that = this;
			context.webAPI.retrieveMultipleRecords('crf6e_appointment', "?fetchXml=" + xml)
                .then(function (response: ComponentFramework.WebApi.RetrieveMultipleResponse) {
                    var $html = `<table class="appointments">
                        <caption>Clinic Appointments: </caption>
                        <tr>
                            <th>Appointment Name</th>
                            <th>Appointment Date</th>
                        </tr>
                        ${response.entities.map(row => `<tr>
                            <td>${row.crf6e_name}</td>
                            <td>${row.crf6e_appointment_date}</td>
                        </tr>`).join('')}
                    </table>`
                    that.tableContainer.innerHTML = $html;
                }, function (error) {
                    console.error("Error: ", error)
                })
		}
	}

	public getOutputs(): IOutputs {
		return {};
	}

	public destroy(): void {
	}
}