import { BeforeUpdate, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimeStampEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
