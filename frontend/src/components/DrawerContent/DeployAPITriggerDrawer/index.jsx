import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Drawer, Typography } from '@mui/material';
import { useState } from 'react';
import { useGlobalEnvironmentState } from '../../EnviromentDropdown';
import { IOSSwitch } from '../SchedulerDrawer/IOSSwitch';
import ApiKey from './ApiKey';
import ApiTriggerExampleDrawer from '../ApiTriggerExampleDrawer';

let host = process.env.REACT_APP_DATAPLANE_ENDPOINT;
if (host === '') {
    host = window.location.origin;
}
const PUBLIC = `${host}/publicapi/deployment/api-trigger/latest/`;
const PRIVATE = `https://{{ HOST }}/privateapi/deployment/api-trigger/latest/`;

const DeployAPITRiggerDrawer = ({ handleClose, triggerID, switches, generateDeploymentTrigger }) => {
    // Global state
    const Environment = useGlobalEnvironmentState();

    // Local state
    const [isOpenExampleDrawer, setIsOpenExampleDrawer] = useState(false);
    const [isExamplePrivate, setIsExamplePrivate] = useState(false);

    return (
        <Box position="relative" width="100%" mb={10}>
            <Box sx={{ p: '4.125rem 3.81rem', paddingTop: '26px' }}>
                {/* Title and Save/Close buttons */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
                    {/* Title */}
                    <Box>
                        <Typography component="h2" variant="h2">
                            API Trigger
                        </Typography>
                    </Box>

                    {/* Save/Close buttons */}
                    <Box top="26px" right="39px" display="flex" alignItems="center">
                        <Button //
                            onClick={() => {
                                generateDeploymentTrigger();
                                handleClose();
                            }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ paddingLeft: '26px', paddingRight: '26px', marginLeft: '20px' }}>
                            Save
                        </Button>
                        <Button
                            onClick={handleClose}
                            style={{ paddingLeft: '16px', paddingRight: '16px', marginLeft: '20px' }}
                            variant="text"
                            startIcon={<FontAwesomeIcon icon={faTimes} />}>
                            Close
                        </Button>
                    </Box>
                </Box>

                {/* Main section */}
                {/* Public API endpoint */}
                <Box>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" fontSize="1.0625rem" lineHeight={2}>
                            Public API endpoint
                        </Typography>
                        <Typography onClick={() => setIsOpenExampleDrawer(true)} fontSize="0.8125rem" color="primary.main" ml={3} sx={{ cursor: 'pointer' }}>
                            See example
                        </Typography>
                    </Box>
                    <Typography variant="subtitle2" fontSize="0.75rem" fontWeight={400}>
                        Anyone with this link can trigger this workflow. To use a specific version, change “latest” with this format “v1.2.4”
                    </Typography>
                    <Box display="flex" alignItems="center" mt={3}>
                        <IOSSwitch
                            onClick={() => generateDeploymentTrigger({ publicLive: !switches.publicLive })}
                            checked={switches.publicLive}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography fontSize={13} ml={1.5} color={switches.publicLive ? 'status.pipelineOnlineText' : '#F80000'}>
                            {switches.publicLive ? 'Live' : 'Offline'}
                        </Typography>
                        <Box display="flex" alignItems="center" position="absolute" ml={15}>
                            <Typography>{PUBLIC + triggerID}</Typography>
                            <Button //
                                onClick={() => navigator.clipboard.writeText(PUBLIC + triggerID)}
                                variant="contained"
                                sx={{ background: '#8a8a8a' }}
                                style={{ paddingLeft: '26px', paddingRight: '26px', marginLeft: '30px' }}>
                                Copy link
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Box mb={10} />

                {/* Private API endpoint */}
                <Box>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" fontSize="1.0625rem" lineHeight={2}>
                            Private API endpoint
                        </Typography>
                        <Typography
                            onClick={() => {
                                setIsOpenExampleDrawer(true);
                                setIsExamplePrivate(true);
                            }}
                            fontSize="0.8125rem"
                            color="primary.main"
                            ml={3}
                            sx={{ cursor: 'pointer' }}>
                            See example
                        </Typography>
                    </Box>

                    <Typography fontSize="0.75rem">
                        Servers in your private networking can access this link. Replace &#123;&#123; HOST &#125;&#125; with network location. For example, in Kubernetes, it will
                        be your service.
                    </Typography>

                    <Box display="flex" alignItems="center" mt={3}>
                        <IOSSwitch
                            onClick={() => generateDeploymentTrigger({ privateLive: !switches.privateLive })}
                            checked={switches.privateLive}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography fontSize={13} ml={1.5} color={switches.privateLive ? 'status.pipelineOnlineText' : '#F80000'}>
                            {switches.privateLive ? 'Live' : 'Offline'}
                        </Typography>
                        <Box display="flex" alignItems="center" position="absolute" ml={15}>
                            <Typography>{PRIVATE + triggerID}</Typography>
                            <Button //
                                onClick={() => navigator.clipboard.writeText(PRIVATE + triggerID)}
                                variant="contained"
                                sx={{ background: '#8a8a8a' }}
                                style={{ paddingLeft: '26px', paddingRight: '26px', marginLeft: '30px' }}>
                                Copy link
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Box mb={10} />

                {/* API Key */}
                <ApiKey apiKeyActive={switches.apiKeyActive} generateDeploymentTrigger={generateDeploymentTrigger} environmentID={Environment.id.get()} triggerID={triggerID} />
            </Box>
            <Drawer
                anchor="right"
                sx={{ width: 'calc(50% )', [`& .MuiDrawer-paper`]: { width: 'calc(50%)' } }}
                open={isOpenExampleDrawer}
                onClose={() => {
                    setIsOpenExampleDrawer(false);
                    setIsExamplePrivate(false);
                }}>
                <ApiTriggerExampleDrawer
                    handleClose={() => {
                        setIsOpenExampleDrawer(false);
                        setIsExamplePrivate(false);
                    }}
                    //
                    host={isExamplePrivate ? PRIVATE : PUBLIC}
                    triggerID={triggerID}
                    isExamplePrivate={isExamplePrivate}
                />
            </Drawer>
        </Box>
    );
};

export default DeployAPITRiggerDrawer;
