import { Button } from '@chakra-ui/button';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import React from 'react';
import GDatePicker from '../GDatePicker/GDatePicker';
import GTextInput from '../GTextInput/GTextInput';

const ProjectCreateModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <GTextInput
            title="Name"
            isRequired
            placeholder="Type in your dream project name"
          />
          <GTextInput
            title="Key"
            isRequired
            placeholder="Auto generate from your project name"
            tooltip="Choose a descriptive prefix for your project’s task keys to recognize work from this project."
          />
          <GTextInput
            title="Description"
            placeholder="Type in project description"
            isMultiline
          />
          <GDatePicker title="Estimate Duration" isRequired />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="orange" mr={3}>
            Create Project
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectCreateModal;
