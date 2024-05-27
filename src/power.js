import React from 'react';

import { PowerBIEmbed } from 'powerbi-client-react';
import {models} from 'powerbi-client';
import './App.css'


console.log(models.TokenType.Aad)

function Power() {
  return (
  <div className='power'>
	<header className="App-header">
    <div class="power">
      <PowerBIEmbed
	embedConfig = {{
		type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
		id: 'b63f288d-61b1-4e75-8f76-68d2c6796a5a',
    accessToken :"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSIsImtpZCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOWQyNjhlM2ItNWJiYy00NDRlLTlmZDMtOWQxODdiZTc5MzZlLyIsImlhdCI6MTcwNjM1OTEyNiwibmJmIjoxNzA2MzU5MTI2LCJleHAiOjE3MDYzNjQzMTIsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84VkFBQUErWm03dEY0UGdCcW14am9rcVNzUW9ocm85VmRNcWE1YUN3alM2ZURVWDd1NGhNb0Jxd2FRc1BGK1doMk1uZzFETUtVWXB1b2MzcnM4Ryt6YnJDTTNwZHhjRmhqMGNLY0xkbDRmVFdGWllmST0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJTcmkiLCJnaXZlbl9uYW1lIjoiVXNoYSIsImlwYWRkciI6IjEwMy4yNDYuMTk1LjIyOSIsIm5hbWUiOiJVc2hhIFNyaSIsIm9pZCI6IjFjN2M5ZTQxLWRmNTEtNDllYS05YmY0LWFlNDFiOTJiNmE2ZSIsInB1aWQiOiIxMDAzMjAwMzIwRTQzNDZBIiwicmgiOiIwLkFTc0FPNDRtbmJ4YlRrU2YwNTBZZS1lVGJna0FBQUFBQUFBQXdBQUFBQUFBQUFEQ0FGby4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJNS2RBSURYU25SMEJESU0zUVhNZGJfZU5rQlVnSWROUEVfRFpoUUNielBFIiwidGlkIjoiOWQyNjhlM2ItNWJiYy00NDRlLTlmZDMtOWQxODdiZTc5MzZlIiwidW5pcXVlX25hbWUiOiJ1c2hhc3JpQGthbmRlMTIzNC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJ1c2hhc3JpQGthbmRlMTIzNC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiIwb2pxaTEzc0lVbVA2cUtEMWVvTkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3BsIjoiZW4ifQ.QX5uoJepBNgVdgvrno7D_poPjKW7uwxy4cg5kvpDP_ZZXvgaPOCylDSHs2WjqlV94pTX0W05NxQmoAOoe27dIA2vIiGXEgmG7OGHFHUpEjIASujBfnwD4MusZi0jPEixcVEJQnkn6Xu2Fc9P7n8TAmuMEgv_SqR5DMiU1tsWH3kwL56jIuBzd-Mh8SO1Sug7b-UUtbFgO0MrPK1t2mFP8K2mxCoWCVVt-9xdiPycUTgiJVWOrqcAPN49LwdPHe2tFa0OZ2c2MV_jiHzxszEMfw6W1EBZ-aOo37YjuoA39l4GeIjwScrtzBSwqGlSGcBt45O9NFByrvPryRZRB4ePrw",
		embedUrl: "https://app.powerbi.com/reportEmbed?reportId=b63f288d-61b1-4e75-8f76-68d2c6796a5a&groupId=a46943f7-39e2-4411-a54e-9513a5bbaa73&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZSwiZGlzYWJsZUFuZ3VsYXJKU0Jvb3RzdHJhcFJlcG9ydEVtYmVkIjp0cnVlfX0%3d",
		tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
		settings: {
			panes: {
				filters: {
					expanded: false,
					visible: true
				}
			},
			background: models.BackgroundType.Transparent,
		}
	}}

	eventHandlers = {
		new Map([
			['loaded', function () {console.log('Report loaded');}],
			['rendered', function () {console.log('Report rendered');}],
			['error', function (event) {console.log(event.detail);}],
			['visualClicked', () => console.log('visual clicked')],
			['pageChanged', (event) => console.log(event)],
		])
	}

	cssClassName = { "Embed-container" }

	getEmbeddedComponent = { (embeddedReport) => {
		window.report = embeddedReport;
	}}
/>
</div>
</header>
</div>
   
  );
}

export default Power;
