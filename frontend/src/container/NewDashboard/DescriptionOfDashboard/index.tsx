import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import useComponentPermission from 'hooks/useComponentPermission';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
	ToggleEditMode,
	UpdateDashboardTitleDescriptionTags,
	UpdateDashboardTitleDescriptionTagsProps,
} from 'store/actions';
import { AppState } from 'store/reducers';
import AppActions from 'types/actions';
import AppReducer from 'types/reducer/app';
import DashboardReducer from 'types/reducer/dashboards';

import DashboardVariableSelection from '../DashboardVariablesSelection';
import SettingsDrawer from './SettingsDrawer';
import ShareModal from './ShareModal';

function DescriptionOfDashboard({
	updateDashboardTitleDescriptionTags,
	toggleEditMode,
}: DescriptionOfDashboardProps): JSX.Element {
	const { dashboards, isEditMode } = useSelector<AppState, DashboardReducer>(
		(state) => state.dashboards,
	);

	const [selectedDashboard] = dashboards;
	const selectedData = selectedDashboard.data;
	const { title } = selectedData;
	const { tags } = selectedData;
	const { description } = selectedData;

	const [updatedTitle, setUpdatedTitle] = useState<string>(title);
	const [updatedTags, setUpdatedTags] = useState<string[]>(tags || []);
	const [updatedDescription, setUpdatedDescription] = useState(
		description || '',
	);
	const [isJSONModalVisible, isIsJSONModalVisible] = useState<boolean>(false);

	const { t } = useTranslation('common');
	const { role } = useSelector<AppState, AppReducer>((state) => state.app);
	const [editDashboard] = useComponentPermission(['edit_dashboard'], role);

	const onClickEditHandler = useCallback(() => {
		if (isEditMode) {
			const dashboard = selectedDashboard;
			// @TODO need to update this function to take title,description,tags only
			updateDashboardTitleDescriptionTags({
				dashboard: {
					...dashboard,
					data: {
						...dashboard.data,
						description: updatedDescription,
						tags: updatedTags,
						title: updatedTitle,
					},
				},
			});
		} else {
			toggleEditMode();
		}
	}, [
		isEditMode,
		updatedTitle,
		updatedTags,
		updatedDescription,
		selectedDashboard,
		toggleEditMode,
		updateDashboardTitleDescriptionTags,
	]);

	const onToggleHandler = (): void => {
		isIsJSONModalVisible((state) => !state);
	};

	return (
		<Card>
			<Row>
				<Col style={{ flex: 1 }}>
					<Typography.Title level={4} style={{ padding: 0, margin: 0 }}>
						{title}
					</Typography.Title>
					<Typography>{description}</Typography>
					<div style={{ margin: '0.5rem 0' }}>
						{tags?.map((e) => (
							<Tag key={e}>{e}</Tag>
						))}
					</div>
					<DashboardVariableSelection />
				</Col>
				<Col>
					<ShareModal
						{...{
							isJSONModalVisible,
							onToggleHandler,
							selectedData,
						}}
					/>
					<Space direction='vertical'>

						{editDashboard && <SettingsDrawer />}
						<Button
							style={{ width: '100%' }}
							type="dashed"
							onClick={onToggleHandler}
							icon={<ShareAltOutlined />}
						>
							{t('share')}
						</Button>
					</Space>
				</Col>
			</Row>
		</Card >
	);
}

interface DispatchProps {
	updateDashboardTitleDescriptionTags: (
		props: UpdateDashboardTitleDescriptionTagsProps,
	) => (dispatch: Dispatch<AppActions>) => void;
	toggleEditMode: () => void;
}

const mapDispatchToProps = (
	dispatch: ThunkDispatch<unknown, unknown, AppActions>,
): DispatchProps => ({
	updateDashboardTitleDescriptionTags: bindActionCreators(
		UpdateDashboardTitleDescriptionTags,
		dispatch,
	),
	toggleEditMode: bindActionCreators(ToggleEditMode, dispatch),
});

type DescriptionOfDashboardProps = DispatchProps;

export default connect(null, mapDispatchToProps)(DescriptionOfDashboard);
