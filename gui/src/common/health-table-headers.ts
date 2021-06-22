/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
export const healthTableHeaders = {
    healthTableHeaderList: [
        {
          "field_id": "resource",
          "label": "Resource",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "text"
            }
        },
        {
          "field_id": "id",
          "label": "Resource ID",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "text"
            }
        },
        {
          "field_id": "status",
          "label": "Status",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "image",
            "mapValueToClassName": {
                "online": "cortx-cluster-status cortx-status-online",
                "offline": "cortx-cluster-status cortx-status-offline",
                "degraded": "cortx-cluster-status cortx-status-degraded",
                "unknown": "cortx-cluster-status cortx-status-unknown"
              }
          }
        },
        {
          "field_id": "last_updated_time",
          "label": "Last Updated",
          "display_id": 201,
          "sortable": false,
          "filterable": false,
          "display": true,
          "value": {
            "type": "date"
            }
        },
    ]
}