import { RenderLogicControl } from '@x-apaas/x-dcloud-page-engine'
import formEditLogic from './form-edit.logic'
import CUSTOM_READ from './form-read.logic'

RenderLogicControl.registerRenderLogic(formEditLogic.renderLogicName, formEditLogic)
RenderLogicControl.registerRenderLogic(CUSTOM_READ.renderLogicName, CUSTOM_READ)