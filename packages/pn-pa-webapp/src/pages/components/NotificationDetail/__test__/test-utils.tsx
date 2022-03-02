import { NotificationStatus } from "../../../../redux/dashboard/types";
import { DigitalDomicileType, NotificationDetail, NotificationFeePolicy, PhysicalCommunicationType } from "../../../../redux/notification/types";

export const NOTIFICATION: NotificationDetail = {
	iun: 'c_b963-220220221119',
	paNotificationId: '220220221119',
	subject: 'Prova - status',
	sentAt: '2022-02-21T10:19:33.440Z',
	cancelledIun: 'mocked-cancelledIun',
	cancelledByIun: 'mocked-cancelledByIun',
	recipients: [{
		taxId: 'CGNNMO80A03H501U',
		denomination: 'Analogico Ok',
		digitalDomicile: {
			address: 'mail@pec.it',
			type: DigitalDomicileType.PEC
		},
		physicalAddress: {
			at: 'Presso qualcuno',
			address: 'In via del tutto eccezionale',
			addressDetails: 'scala A',
			zip: '00100',
			municipality: 'Comune',
			province: 'PROV',
			foreignState: ''
		},
		token: 'mocked-token'
	}],
	documents: [{
		digests: {
			sha256: '3b56e2b5641d5807fa83d6bc906a35135a6b8b7c21e694b859bbafc3d718d659'
		},
		contentType: 'application/pdf'
	}],
	payment: {
		iuv: '',
		notificationFeePolicy: NotificationFeePolicy.DELIVERY_MODE,
		f24: {
			flatRate: {
				digests: {
					sha256: 'mocked-sha256'
				},
				contentType: 'mocked-contentType'
			},
			digital: {
				digests: {
					sha256: 'mocked-sha256'
				},
				contentType: 'mocked-contentType'
			},
			analog: {
				digests: {
					sha256: 'mocked-sha256'
				},
				contentType: 'mocked-contentType'
			}
		}
	},
	notificationStatus: NotificationStatus.PAID,
	notificationStatusHistory: [{
		status: NotificationStatus.DELIVERED,
		activeFrom: '2022-02-22T10:19:33.440Z'
	}],
	timeline: [],
	physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890
};